import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchLocations, type GeocodingResult } from '../services/geocoding';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const showResultsDropdown = hasQuery && results.length > 0;
  const showEmptyState =
    trimmedQuery.length >= 2 && hasSearched && !loading && results.length === 0;

  function handleSelect(result: GeocodingResult) {
    setQuery('');
    setResults([]);
    router.push({
      pathname: '/location/[id]',
      params: {
        id: result.id,
        name: result.name,
        lat: result.latitude,
        lon: result.longitude,
      },
    });
  }

  useEffect(() => {
    setHasSearched(false);

    const timer = setTimeout(async () => {
      if (trimmedQuery.length >= 2) {
        setLoading(true);

        try {
          const data = await searchLocations(trimmedQuery);
          setResults(data);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
          setHasSearched(true);
        }
      } else {
        setResults([]);
        setLoading(false);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [trimmedQuery]);

  return (
    <View className="relative z-10">
      <View className="h-12 flex-row items-center rounded-2xl border border-white/25 bg-white/15 px-4">
        <MaterialCommunityIcons name="magnify" size={20} color="rgba(255,255,255,0.7)" />
        <TextInput
          className="ml-2 flex-1 text-base text-white"
          placeholder="Search city..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {loading && <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />}
      </View>

      {(showResultsDropdown || showEmptyState) && (
        <View className="absolute left-0 right-0 top-14 overflow-hidden rounded-2xl border border-white/20 bg-[#1a1a3e]">
          {showResultsDropdown ? (
            results.map((item, index) => (
              <TouchableOpacity
                key={String(item.id)}
                className={`flex-row items-center px-4 py-3 ${index < results.length - 1 ? 'border-b border-white/10' : ''}`}
                onPress={() => handleSelect(item)}
              >
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={18}
                  color="rgba(255,255,255,0.6)"
                />

                <View className="ml-3">
                  <Text className="font-medium text-white">{item.name}</Text>
                  <Text className="text-sm text-white/60">
                    {[item.admin1, item.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="px-4 py-4">
              <Text className="text-sm text-white/60">No results found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
