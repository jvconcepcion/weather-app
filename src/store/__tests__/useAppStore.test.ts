import type { City } from '../useAppStore';
import { useAppStore } from '../useAppStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
    getAllKeys: jest.fn().mockResolvedValue([]),
    multiGet: jest.fn().mockResolvedValue([]),
    multiSet: jest.fn().mockResolvedValue(undefined),
    multiRemove: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../lib/supabase');

const CITY_A: City = { id: 1, name: 'Manila', lat: 14.5995, lon: 120.9842 };
const CITY_B: City = { id: 2, name: 'Tokyo', lat: 35.6762, lon: 139.6503 };
const CITY_C: City = { id: 3, name: 'London', lat: 51.5072, lon: -0.1276 };

const INITIAL_STATE = {
  unit: 'celsius' as const,
  favorites: [],
  recentSearches: [],
  weatherCache: {},
  hapticsEnabled: true,
  pushToken: null,
  pushTokenError: null,
  userId: null,
};

beforeEach(() => {
  useAppStore.setState(INITIAL_STATE);
});

describe('initial state', () => {
  it('starts with expected defaults', () => {
    const state = useAppStore.getState();
    expect(state.unit).toBe('celsius');
    expect(state.favorites).toEqual([]);
    expect(state.recentSearches).toEqual([]);
    expect(state.weatherCache).toEqual({});
    expect(state.hapticsEnabled).toBe(true);
    expect(state.pushToken).toBeNull();
    expect(state.userId).toBeNull();
  });
});

describe('unit', () => {
  it('setUnit switches to fahrenheit', () => {
    useAppStore.getState().setUnit('fahrenheit');
    expect(useAppStore.getState().unit).toBe('fahrenheit');
  });

  it('setUnit switches back to celsius', () => {
    useAppStore.setState({ unit: 'fahrenheit' });
    useAppStore.getState().setUnit('celsius');
    expect(useAppStore.getState().unit).toBe('celsius');
  });
});

describe('haptics', () => {
  it('setHapticsEnabled toggles off', () => {
    useAppStore.getState().setHapticsEnabled(false);
    expect(useAppStore.getState().hapticsEnabled).toBe(false);
  });

  it('setHapticsEnabled toggles back on', () => {
    useAppStore.setState({ hapticsEnabled: false });
    useAppStore.getState().setHapticsEnabled(true);
    expect(useAppStore.getState().hapticsEnabled).toBe(true);
  });
});

describe('favorites', () => {
  it('addFavorite adds a city', () => {
    useAppStore.getState().addFavorite(CITY_A);
    expect(useAppStore.getState().favorites).toContainEqual(CITY_A);
  });

  it('addFavorite does not duplicate', () => {
    useAppStore.getState().addFavorite(CITY_A);
    useAppStore.getState().addFavorite(CITY_A);
    expect(useAppStore.getState().favorites).toHaveLength(1);
  });

  it('removeFavorite removes the correct city', () => {
    useAppStore.setState({ favorites: [CITY_A, CITY_B] });
    useAppStore.getState().removeFavorite(CITY_A.id);
    const { favorites } = useAppStore.getState();
    expect(favorites).not.toContainEqual(CITY_A);
    expect(favorites).toContainEqual(CITY_B);
  });

  it('clearFavorites empties the list', () => {
    useAppStore.setState({ favorites: [CITY_A, CITY_B] });
    useAppStore.getState().clearFavorites();
    expect(useAppStore.getState().favorites).toEqual([]);
  });

  it('setFavorites replaces the list', () => {
    useAppStore.setState({ favorites: [CITY_A] });
    useAppStore.getState().setFavorites([CITY_B, CITY_C]);
    expect(useAppStore.getState().favorites).toEqual([CITY_B, CITY_C]);
  });
});

describe('recentSearches', () => {
  it('addRecentSearch prepends the city', () => {
    useAppStore.getState().addRecentSearch(CITY_A);
    useAppStore.getState().addRecentSearch(CITY_B);
    expect(useAppStore.getState().recentSearches[0]).toEqual(CITY_B);
  });

  it('addRecentSearch moves an existing city to the front', () => {
    useAppStore.setState({ recentSearches: [CITY_A, CITY_B] });
    useAppStore.getState().addRecentSearch(CITY_A);
    const { recentSearches } = useAppStore.getState();
    expect(recentSearches[0]).toEqual(CITY_A);
    expect(recentSearches).toHaveLength(2);
  });

  it('addRecentSearch caps the list at 5', () => {
    const cities = [1, 2, 3, 4, 5, 6].map((id) => ({
      id,
      name: `City${id}`,
      lat: id,
      lon: id,
    }));
    cities.forEach((c) => useAppStore.getState().addRecentSearch(c));
    expect(useAppStore.getState().recentSearches).toHaveLength(5);
  });

  it('removeRecentSearch removes the correct city', () => {
    useAppStore.setState({ recentSearches: [CITY_A, CITY_B] });
    useAppStore.getState().removeRecentSearch(CITY_A.id);
    expect(useAppStore.getState().recentSearches).not.toContainEqual(CITY_A);
    expect(useAppStore.getState().recentSearches).toContainEqual(CITY_B);
  });

  it('clearRecentSearches empties the list', () => {
    useAppStore.setState({ recentSearches: [CITY_A, CITY_B] });
    useAppStore.getState().clearRecentSearches();
    expect(useAppStore.getState().recentSearches).toEqual([]);
  });
});

describe('weatherCache', () => {
  const KEY = '14.5995|120.9842';
  const ENTRY = { data: { temp: 30 }, unit: 'celsius' as const, timestamp: 1000 };

  it('setWeatherCache stores an entry', () => {
    useAppStore.getState().setWeatherCache(KEY, ENTRY);
    expect(useAppStore.getState().weatherCache[KEY]).toEqual(ENTRY);
  });

  it('getWeatherCache retrieves a stored entry', () => {
    useAppStore.setState({ weatherCache: { [KEY]: ENTRY } });
    expect(useAppStore.getState().getWeatherCache(KEY)).toEqual(ENTRY);
  });

  it('getWeatherCache returns undefined for a missing key', () => {
    expect(useAppStore.getState().getWeatherCache('0|0')).toBeUndefined();
  });

  it('clearWeatherCache empties all entries', () => {
    useAppStore.setState({ weatherCache: { [KEY]: ENTRY } });
    useAppStore.getState().clearWeatherCache();
    expect(useAppStore.getState().weatherCache).toEqual({});
  });
});
