import { create } from 'zustand';

export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

interface AppStore {
  unit: Unit;
  favorites: City[];
  recentSearches: City[];

  setUnit: (unit: Unit) => void;

  addFavorite: (city: City) => void;
  removeFavorite: (cityId: number) => void;

  addRecentSearch: (city: City) => void;
  clearRecentSearches: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  unit: 'celsius',
  favorites: [],
  recentSearches: [],

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

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
