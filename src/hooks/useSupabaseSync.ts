import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { City, useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';

export function useSupabaseSync() {
  const user = useAuthStore((state) => state.user);
  const setUserId = useAppStore((state) => state.setUserId);
  const setFavorites = useAppStore((state) => state.setFavorites);
  const setRecentSearches = useAppStore((state) => state.setRecentSearches);

  useEffect(() => {
    if (!user) {
      setUserId(null);
      setFavorites([]);
      setRecentSearches([]);
      return;
    }

    setUserId(user.id);

    async function syncOnLogin() {
      // Read current local data inside async to avoid stale closure
      const { favorites: localFavs, recentSearches: localRecent } = useAppStore.getState();

      // FAVORITES
      const { data: remoteFavsRaw } = await supabase
        .from('favorites')
        .select('city_id, name, lat, lon')
        .eq('user_id', user!.id);

      const remoteFavs: City[] = (remoteFavsRaw ?? []).map((r) => ({
        id: r.city_id,
        name: r.name,
        lat: r.lat,
        lon: r.lon,
      }));

      // Upload any local favorites that aren't in Supabase yet (guest data)
      const remoteIds = new Set(remoteFavs.map((c) => c.id));
      const localOnlyFavs = localFavs.filter((c) => !remoteIds.has(c.id));

      if (localOnlyFavs.length > 0) {
        const { error } = await supabase.from('favorites').upsert(
          localOnlyFavs.map((c) => ({
            user_id: user!.id,
            city_id: c.id,
            name: c.name,
            lat: c.lat,
            lon: c.lon,
          })),
          { onConflict: 'user_id,city_id' },
        );
        if (error) console.warn('[Supabase] sync favorites upload:', error.message);
      }

      setFavorites([...remoteFavs, ...localOnlyFavs]);

      // RECENT SEARCHES
      const { data: remoteRecentRaw } = await supabase
        .from('recent_searches')
        .select('city_id, name, lat, lon, searched_at')
        .eq('user_id', user!.id)
        .order('searched_at', { ascending: false })
        .limit(5);

      const remoteRecent: City[] = (remoteRecentRaw ?? []).map((r) => ({
        id: r.city_id,
        name: r.name,
        lat: r.lat,
        lon: r.lon,
      }));

      // Upload local recent searches not already in Supabase
      const remoteRecentIds = new Set(remoteRecent.map((c) => c.id));
      const localOnlyRecent = localRecent.filter((c) => !remoteRecentIds.has(c.id));

      if (localOnlyRecent.length > 0) {
        const { error } = await supabase.from('recent_searches').upsert(
          localOnlyRecent.map((c) => ({
            user_id: user!.id,
            city_id: c.id,
            name: c.name,
            lat: c.lat,
            lon: c.lon,
            searched_at: new Date().toISOString(),
          })),
          { onConflict: 'user_id,city_id' },
        );
        if (error) console.warn('[Supabase] sync recent upload:', error.message);
      }

      setRecentSearches([...remoteRecent, ...localOnlyRecent].slice(0, 5));
    }

    syncOnLogin();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
}
