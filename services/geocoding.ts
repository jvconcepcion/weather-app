const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

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

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error(`Geocoding API error: ${response.status}`);
  const data = await response.json() as { results?: GeocodingResult[] };
  return data.results ?? [];
}
