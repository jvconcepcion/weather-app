import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export type LocationState = {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  error: string | null;
  permissionDenied: boolean;
  loading: boolean;
  retry: () => void;
};

type ResolvedLocation = {
  latitude: number;
  longitude: number;
  cityName: string;
};

// Persists across unmount/remount within the same session so returning to home
// from settings doesn't re-run the GPS and reverse geocode sequence.
let locationCache: ResolvedLocation | null = null;

export function useLocation(): LocationState {
  const [retryKey, setRetryKey] = useState(0);
  const [state, setState] = useState<Omit<LocationState, 'retry'>>(() =>
    locationCache
      ? { ...locationCache, error: null, permissionDenied: false, loading: false }
      : {
          latitude: null,
          longitude: null,
          cityName: null,
          error: null,
          permissionDenied: false,
          loading: true,
        },
  );

  const retry = useCallback(() => {
    locationCache = null;
    setState({
      latitude: null,
      longitude: null,
      cityName: null,
      error: null,
      permissionDenied: false,
      loading: true,
    });
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (locationCache) return;

    let cancelled = false;

    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            error: 'Location permission denied',
            permissionDenied: true,
            loading: false,
          }));
        }
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const cityName = address?.city ?? address?.region ?? 'My Location';

      locationCache = { latitude, longitude, cityName };

      if (!cancelled) {
        setState({
          latitude,
          longitude,
          cityName,
          error: null,
          permissionDenied: false,
          loading: false,
        });
      }
    }

    getLocation().catch((err) => {
      if (!cancelled) {
        setState((prev) => ({
          ...prev,
          error: String(err),
          permissionDenied: false,
          loading: false,
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return { ...state, retry };
}
