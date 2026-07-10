const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10_000;

export type CurrentWeather = {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  uv_index: number;
};

export type HourlyWeather = {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
};

export type DailyWeather = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
};

export type WeatherResponse = {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
};

export async function fetchWeather(
  latitude: number,
  longitude: number,
  unit: 'celsius' | 'fahrenheit' = 'celsius',
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
    ].join(','),
    hourly: 'temperature_2m,weather_code',
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'wind_speed_10m_max',
      'uv_index_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    forecast_days: '8',
    temperature_unit: unit,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}?${params}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    return response.json() as Promise<WeatherResponse>;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Weather request timed out. Check your connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
