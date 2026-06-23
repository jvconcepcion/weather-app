import { WeatherSkeleton } from '@/components/WeatherSkeleton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentWeather } from '../components/CurrentWeather';
import { DailyForecast } from '../components/DailyForecast';
import { HourlyForecast } from '../components/HourlyForecast';
import { SearchBar } from '../components/SearchBar';
import { WeatherStats } from '../components/WeatherStats';
import { getGradient, NIGHT_GRADIENT } from '../constants/theme';
import { getWMO } from '../constants/wmo';
import { useLocation } from '../hooks/useLocation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useWeather } from '../hooks/useWeather';
import { useAppStore } from '../store/useAppStore';

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const weather = useWeather(location.latitude, location.longitude, refreshKey);
  const unit = useAppStore((state) => state.unit);
  const setUnit = useAppStore((state) => state.setUnit);
  const recentSearches = useAppStore((state) => state.recentSearches);
  const clearRecentSearches = useAppStore((state) => state.clearRecentSearches);
  const isConnected = useNetworkStatus();

  const handleToggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  async function handleRefresh() {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
  }

  function handleRecentPress(city: { id: number; name: string; lat: number; lon: number }) {
    router.push({
      pathname: '/location/[id]',
      params: {
        id: String(city.id),
        name: city.name,
        lat: String(city.lat),
        lon: String(city.lon),
      },
    });
  }

  const gradient = weather.data
    ? getGradient(
        getWMO(weather.data.current.weather_code).condition,
        weather.data.daily.sunrise[0],
        weather.data.daily.sunset[0],
      )
    : NIGHT_GRADIENT;

  useEffect(() => {
    if (!weather.loading) {
      setIsRefreshing(false);
    }
  }, [weather.loading]);

  return (
    <LinearGradient colors={gradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="white" />
          }
        >
          <View
            style={{
              marginTop: 16,
              marginBottom: 24,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <SearchBar />
            </View>

            <TouchableOpacity
              onPress={handleToggleUnit}
              className="h-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 px-4"
            >
              <Text className="font-medium text-white">{unit === 'celsius' ? '°C' : '°F'}</Text>
            </TouchableOpacity>
          </View>

          {recentSearches.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Recent Searches
                </Text>
                <TouchableOpacity
                  onPress={clearRecentSearches}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={14}
                    color="rgba(255, 255, 255, 0.85)"
                  />
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {recentSearches.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    onPress={() => handleRecentPress(city)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 999,
                      backgroundColor: 'rgba(255, 255, 255, 0.14)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.18)',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {!isConnected && (
            <View className="mb-4 flex-row items-center rounded-2xl border border-white/20 bg-black/20 px-4 py-3">
              <View className="mr-3 h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <Text className="flex-1 text-sm text-white">
                No internet connection.{' '}
                <Text className="text-white/80">Showing the last saved weather update.</Text>
              </Text>
            </View>
          )}

          {location.loading || weather.loading ? (
            <WeatherSkeleton />
          ) : location.error ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <Text className="text-center text-white">{location.error}</Text>
              <TouchableOpacity
                onPress={handleRefresh}
                className="m-2 rounded-md border border-white px-4 py-2"
              >
                <Text className="text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : weather.error ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <Text className="text-center text-white">{weather.error}</Text>
              <TouchableOpacity
                onPress={handleRefresh}
                className="m-2 rounded-md border border-white px-4 py-2"
              >
                <Text className="text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : weather.data ? (
            <View style={{ gap: 16 }}>
              <CurrentWeather data={weather.data.current} cityName={location.cityName ?? ''} />
              <WeatherStats
                data={weather.data.current}
                sunrise={weather.data.daily.sunrise[0]}
                sunset={weather.data.daily.sunset[0]}
              />
              <HourlyForecast data={weather.data.hourly} />
              <DailyForecast data={weather.data.daily} />
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
