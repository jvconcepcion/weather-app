import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

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
  language: string | null;
  favorites: City[];
  recentSearches: City[];
  weatherCache: Record<string, CachedWeatherEntry>;
  hapticsEnabled: boolean;
  pushToken: string | null;
  pushTokenError: string | null;
  userId: string | null;

  setUnit: (unit: Unit) => void;
  setLanguage: (lang: string | null) => void;
  setPushToken: (token: string | null) => void;
  setPushTokenError: (error: string | null) => void;
  setUserId: (userId: string | null) => void;
  setFavorites: (cities: City[]) => void;
  setRecentSearches: (cities: City[]) => void;

  addFavorite: (city: City) => void;
  removeFavorite: (cityId: number) => void;
  clearFavorites: () => void;

  addRecentSearch: (city: City) => void;
  removeRecentSearch: (cityId: number) => void;
  clearRecentSearches: () => void;

  setHapticsEnabled: (enabled: boolean) => void;

  setWeatherCache: (key: string, entry: CachedWeatherEntry) => void;
  getWeatherCache: (key: string) => CachedWeatherEntry | undefined;
  clearWeatherCache: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      unit: 'celsius',
      language: null,
      favorites: [],
      recentSearches: [],
      weatherCache: {},
      hapticsEnabled: true,
      pushToken: null,
      pushTokenError: null,
      userId: null,

      setUnit: (unit) => set({ unit }),
      setLanguage: (lang) => set({ language: lang }),
      setPushToken: (token) => set({ pushToken: token }),
      setPushTokenError: (error) => set({ pushTokenError: error }),
      setUserId: (userId) => set({ userId }),
      setFavorites: (cities) => set({ favorites: cities }),
      setRecentSearches: (cities) => set({ recentSearches: cities }),

      addFavorite: (city) => {
        set((state) => {
          if (state.favorites.some((fav) => fav.id === city.id)) return state;
          return { favorites: [...state.favorites, city] };
        });
        const { userId } = get();
        if (userId) {
          supabase
            .from('favorites')
            .upsert(
              { user_id: userId, city_id: city.id, name: city.name, lat: city.lat, lon: city.lon },
              { onConflict: 'user_id,city_id' },
            )
            .then(({ error }) => {
              if (error) console.warn('[Supabase] addFavorite:', error.message);
            });
        }
      },

      removeFavorite: (cityId) => {
        set((state) => ({ favorites: state.favorites.filter((city) => city.id !== cityId) }));
        const { userId } = get();
        if (userId) {
          supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, city_id: cityId })
            .then(({ error }) => {
              if (error) console.warn('[Supabase] removeFavorite:', error.message);
            });
        }
      },

      clearFavorites: () => {
        set({ favorites: [] });
        const { userId } = get();
        if (userId) {
          supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .then(({ error }) => {
              if (error) console.warn('[Supabase] clearFavorites:', error.message);
            });
        }
      },

      addRecentSearch: (city) => {
        set((state) => {
          const filtered = state.recentSearches.filter((item) => item.id !== city.id);
          return { recentSearches: [city, ...filtered].slice(0, 5) };
        });
        const { userId } = get();
        if (userId) {
          supabase
            .from('recent_searches')
            .upsert(
              {
                user_id: userId,
                city_id: city.id,
                name: city.name,
                lat: city.lat,
                lon: city.lon,
                searched_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,city_id' },
            )
            .then(({ error }) => {
              if (error) console.warn('[Supabase] addRecentSearch:', error.message);
            });
        }
      },

      removeRecentSearch: (cityId) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((city) => city.id !== cityId),
        }));
        const { userId } = get();
        if (userId) {
          supabase
            .from('recent_searches')
            .delete()
            .match({ user_id: userId, city_id: cityId })
            .then(({ error }) => {
              if (error) console.warn('[Supabase] removeRecentSearch:', error.message);
            });
        }
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
        const { userId } = get();
        if (userId) {
          supabase
            .from('recent_searches')
            .delete()
            .eq('user_id', userId)
            .then(({ error }) => {
              if (error) console.warn('[Supabase] clearRecentSearches:', error.message);
            });
        }
      },

      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),

      setWeatherCache: (key, entry) =>
        set((state) => ({
          weatherCache: {
            ...state.weatherCache,
            [key]: entry,
          },
        })),

      getWeatherCache: (key) => get().weatherCache[key],

      clearWeatherCache: () => set({ weatherCache: {} }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        unit: state.unit,
        language: state.language,
        favorites: state.favorites,
        recentSearches: state.recentSearches,
        hapticsEnabled: state.hapticsEnabled,
        pushToken: state.pushToken,
      }),
    },
  ),
);
