import { useEffect, useState } from 'react';
import { fetchWeather, type WeatherResponse } from '../services/weather';

export type WeatherState = {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
};

export function useWeather(latitude: number | null, longitude: number | null, refreshKey: number): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetchWeather(latitude, longitude)
      .then(data => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ data: null, loading: false, error: String(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, refreshKey]);

  return state;
}
