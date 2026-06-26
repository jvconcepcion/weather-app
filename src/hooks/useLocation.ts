import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type LocationState = {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  error: string | null;
  loading: boolean;
};

type ResolvedLocation = {
  latitude: number;
  longitude: number;
  cityName: string;
};

// Persists across unmount/remount within the same session so returning to home from settings doesn't re-run the GPS and reverse geocode sequence.
let locationCache: ResolvedLocation | null = null;

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>(() =>
    locationCache
      ? { ...locationCache, error: null, loading: false }
      : { latitude: null, longitude: null, cityName: null, error: null, loading: true },
  );

  useEffect(() => {
    if (locationCache) return;

    let cancelled = false;

    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled) {
          setState((prev) => ({ ...prev, error: 'Location permission denied', loading: false }));
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
        setState({ latitude, longitude, cityName, error: null, loading: false });
      }
    }

    getLocation().catch((err) => {
      if (!cancelled) {
        setState((prev) => ({ ...prev, error: String(err), loading: false }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
