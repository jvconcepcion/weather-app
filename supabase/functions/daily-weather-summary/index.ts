import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

const WMO_LABELS: Record<number, string> = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Icy Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Light Showers',
  81: 'Showers',
  82: 'Heavy Showers',
  85: 'Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm w/ Hail',
  99: 'Thunderstorm w/ Heavy Hail',
};

function getConditionLabel(code: number): string {
  return WMO_LABELS[code] ?? 'Unknown';
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const currentHour = new Date().getUTCHours();

    // Find users with daily summary enabled at this UTC hour
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('daily_summary_enabled', true)
      .eq('preferred_hour', currentHour);

    if (prefError) throw prefError;
    if (!preferences || preferences.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: 'no users scheduled for this hour' }), {
        status: 200,
      });
    }

    const userIds = preferences.map((p) => p.user_id);

    // Get push tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('push_tokens')
      .select('user_id, token')
      .in('user_id', userIds);

    if (tokenError) throw tokenError;

    // Get first favorite city per user (ordered by id so we pick the earliest added)
    const { data: favorites, error: favError } = await supabase
      .from('favorites')
      .select('user_id, city_id, name, lat, lon')
      .in('user_id', userIds)
      .order('id', { ascending: true });

    if (favError) throw favError;

    // Build lookup maps
    const tokenByUser = new Map<string, string>();
    for (const t of tokens ?? []) {
      tokenByUser.set(t.user_id, t.token);
    }

    const cityByUser = new Map<
      string,
      { city_id: number; name: string; lat: number; lon: number }
    >();
    for (const fav of favorites ?? []) {
      if (!cityByUser.has(fav.user_id)) {
        cityByUser.set(fav.user_id, {
          city_id: fav.city_id,
          name: fav.name,
          lat: fav.lat,
          lon: fav.lon,
        });
      }
    }

    // Build push messages
    const messages: object[] = [];

    for (const userId of userIds) {
      const token = tokenByUser.get(userId);
      const city = cityByUser.get(userId);

      // Skip users without a push token or a saved favorite city
      if (!token || !city) continue;

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&temperature_unit=celsius&forecast_days=1`,
      );
      if (!weatherRes.ok) continue;

      const weather = await weatherRes.json();
      const temp = Math.round(weather.current?.temperature_2m ?? 0);
      const code: number = weather.current?.weather_code ?? 0;
      const condition = getConditionLabel(code);

      messages.push({
        to: token,
        title: `Good morning! Weather in ${city.name}`,
        body: `${temp}°C · ${condition}`,
        data: {
          cityId: String(city.city_id),
          cityName: city.name,
          lat: String(city.lat),
          lon: String(city.lon),
        },
      });
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, reason: 'no eligible users (missing token or favorite city)' }),
        { status: 200 },
      );
    }

    // Expo push API accepts up to 100 messages per request
    for (const chunk of chunkArray(messages, 100)) {
      await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(chunk),
      });
    }

    return new Response(JSON.stringify({ sent: messages.length }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
