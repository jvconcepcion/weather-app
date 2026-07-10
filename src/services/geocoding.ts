const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const TIMEOUT_MS = 8_000;

export type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
};

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: '5',
    language: 'en',
    format: 'json',
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}?${params}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Geocoding API error: ${response.status}`);
    const data = (await response.json()) as { results?: GeocodingResult[] };
    return data.results ?? [];
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Search timed out. Check your connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
