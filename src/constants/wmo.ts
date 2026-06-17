export type WMOCondition = 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';

export type WMOEntry = {
  label: string;
  icon: string;
  condition: WMOCondition;
};

export const WMO_CODES: Record<number, WMOEntry> = {
  0: { label: 'Clear Sky', icon: 'weather-sunny', condition: 'clear' },
  1: { label: 'Mainly Clear', icon: 'weather-partly-cloudy', condition: 'clear' },
  2: { label: 'Partly Cloudy', icon: 'weather-partly-cloudy', condition: 'cloudy' },
  3: { label: 'Overcast', icon: 'weather-cloudy', condition: 'cloudy' },
  45: { label: 'Fog', icon: 'weather-fog', condition: 'foggy' },
  48: { label: 'Icy Fog', icon: 'weather-fog', condition: 'foggy' },
  51: { label: 'Light Drizzle', icon: 'weather-rainy', condition: 'rainy' },
  53: { label: 'Drizzle', icon: 'weather-rainy', condition: 'rainy' },
  55: { label: 'Heavy Drizzle', icon: 'weather-pouring', condition: 'rainy' },
  61: { label: 'Light Rain', icon: 'weather-rainy', condition: 'rainy' },
  63: { label: 'Rain', icon: 'weather-rainy', condition: 'rainy' },
  65: { label: 'Heavy Rain', icon: 'weather-pouring', condition: 'rainy' },
  71: { label: 'Light Snow', icon: 'weather-snowy', condition: 'snowy' },
  73: { label: 'Snow', icon: 'weather-snowy', condition: 'snowy' },
  75: { label: 'Heavy Snow', icon: 'weather-snowy-heavy', condition: 'snowy' },
  77: { label: 'Snow Grains', icon: 'weather-snowy', condition: 'snowy' },
  80: { label: 'Light Showers', icon: 'weather-partly-rainy', condition: 'rainy' },
  81: { label: 'Showers', icon: 'weather-rainy', condition: 'rainy' },
  82: { label: 'Heavy Showers', icon: 'weather-pouring', condition: 'rainy' },
  85: { label: 'Snow Showers', icon: 'weather-snowy', condition: 'snowy' },
  86: { label: 'Heavy Snow Showers', icon: 'weather-snowy-heavy', condition: 'snowy' },
  95: { label: 'Thunderstorm', icon: 'weather-lightning-rainy', condition: 'stormy' },
  96: { label: 'Thunderstorm w/ Hail', icon: 'weather-hail', condition: 'stormy' },
  99: { label: 'Thunderstorm w/ Heavy Hail', icon: 'weather-hail', condition: 'stormy' },
};

export function getWMO(code: number): WMOEntry {
  return WMO_CODES[code] ?? { label: 'Unknown', icon: 'weather-cloudy-alert', condition: 'cloudy' };
}
