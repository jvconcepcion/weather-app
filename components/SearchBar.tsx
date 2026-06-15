import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchLocations, type GeocodingResult } from '../services/geocoding';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const data = await searchLocations(query);
          setResults(data);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View className="relative z-10">
      <View className="flex-row items-center bg-white/15 border border-white/25 rounded-2xl px-4 h-12">
        <MaterialCommunityIcons name="magnify" size={20} color="rgba(255,255,255,0.7)" />
        <TextInput
          className="flex-1 ml-2 text-white text-base"
          placeholder="Search city..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {loading && <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />}
      </View>

      {results.length > 0 && (
        <View className="absolute top-14 left-0 right-0 bg-[#1a1a3e] border border-white/20 rounded-2xl overflow-hidden">
          {results.map((item, index) => (
            <TouchableOpacity
              key={String(item.id)}
              className={`flex-row items-center px-4 py-3 ${index < results.length - 1 ? 'border-b border-white/10' : ''}`}
              onPress={() => handleSelect(item)}
            >
              <MaterialCommunityIcons name="map-marker-outline" size={18} color="rgba(255,255,255,0.6)" />
              <View className="ml-3">
                <Text className="text-white font-medium">{item.name}</Text>
                <Text className="text-white/60 text-sm">
                  {[item.admin1, item.country].filter(Boolean).join(', ')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
