import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

export interface CachedWeatherEntry {
  data: unknown;
  unit: Unit;
  timestamp: number;
}

export const getWeatherCacheKey = (lat: number, lon: number) => `${lat}|${lon}`;

interface AppStore {
  unit: Unit;
  favorites: City[];
  recentSearches: City[];
  weatherCache: Record<string, CachedWeatherEntry>;

  setUnit: (unit: Unit) => void;
  addFavorite: (city: City) => void;
  removeFavorite: (cityId: number) => void;
  addRecentSearch: (city: City) => void;
  removeRecentSearch: (cityId: number) => void;
  clearRecentSearches: () => void;

  setWeatherCache: (key: string, entry: CachedWeatherEntry) => void;
  getWeatherCache: (key: string) => CachedWeatherEntry | undefined;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      unit: 'celsius',
      favorites: [],
      recentSearches: [],
      weatherCache: {},

      setUnit: (unit) => set({ unit }),

      addFavorite: (city) =>
        set((state) => {
          const alreadyExists = state.favorites.some((fav) => fav.id === city.id);
          if (alreadyExists) return state;

          return { favorites: [...state.favorites, city] };
        }),

      removeFavorite: (cityId) =>
        set((state) => ({
          favorites: state.favorites.filter((city) => city.id !== cityId),
        })),

      addRecentSearch: (city) =>
        set((state) => {
          const filtered = state.recentSearches.filter((item) => item.id !== city.id);

          return { recentSearches: [city, ...filtered].slice(0, 5) };
        }),

      removeRecentSearch: (cityId) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((city) => city.id !== cityId),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      setWeatherCache: (key, entry) =>
        set((state) => ({
          weatherCache: {
            ...state.weatherCache,
            [key]: entry,
          },
        })),

      getWeatherCache: (key) => get().weatherCache[key],
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
