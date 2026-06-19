import { useEffect, useState } from 'react';
import { fetchWeather, type WeatherResponse } from '../services/weather';
import { useAppStore } from '../store/useAppStore';

export type WeatherState = {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
};

export function useWeather(
  latitude: number | null,
  longitude: number | null,
  refreshKey: number,
): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const unit = useAppStore((state) => state.unit);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetchWeather(latitude, longitude, unit)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: String(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, refreshKey, unit]);

  return state;
}
