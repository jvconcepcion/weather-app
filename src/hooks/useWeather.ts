import { useEffect, useState } from 'react';
import { fetchWeather, type WeatherResponse } from '../services/weather';
import { getWeatherCacheKey, useAppStore } from '../store/useAppStore';

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

    const cacheKey = getWeatherCacheKey(latitude, longitude);
    const { getWeatherCache, setWeatherCache } = useAppStore.getState();

    const cached = getWeatherCache(cacheKey);
    const hasMatchingCache = cached && cached.unit === unit;

    // Show cached data immediately without a skeleton, the fetch below updates it silently in the background.
    setState({
      data: hasMatchingCache ? (cached.data as WeatherResponse) : null,
      loading: !hasMatchingCache,
      error: null,
    });

    fetchWeather(latitude, longitude, unit)
      .then((data) => {
        if (cancelled) return;

        setWeatherCache(cacheKey, {
          data,
          unit,
          timestamp: Date.now(),
        });

        setState({
          data,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;

        // Fall back to any cached data for this location
        if (cached) {
          setState({
            data: cached.data as WeatherResponse,
            loading: false,
            error: null,
          });
          return;
        }

        setState({
          data: null,
          loading: false,
          error: String(err),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, refreshKey, unit]);

  return state;
}
