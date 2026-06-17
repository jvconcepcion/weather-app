import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type LocationState = {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  error: string | null;
  loading: boolean;
};

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    cityName: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
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
