import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentWeather } from '../components/CurrentWeather';
import { HourlyForecast } from '../components/HourlyForecast';
import { SearchBar } from '../components/SearchBar';
import { WeatherStats } from '../components/WeatherStats';
import { getGradient, NIGHT_GRADIENT } from '../constants/theme';
import { getWMO } from '../constants/wmo';
import { useLocation } from '../hooks/useLocation';
import { useWeather } from '../hooks/useWeather';

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const weather = useWeather(location.latitude, location.longitude, refreshKey);

  async function handleRefresh() {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
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
          <View style={{ marginTop: 16, marginBottom: 24 }}>
            <SearchBar />
          </View>

          {location.loading || weather.loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <ActivityIndicator size="large" color="white" />
              <Text className="mt-4 text-white/60">Fetching your weather...</Text>
            </View>
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
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
