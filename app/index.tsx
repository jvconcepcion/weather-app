import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentWeather } from '../components/CurrentWeather';
import { DailyForecast } from '../components/DailyForecast';
import { HourlyForecast } from '../components/HourlyForecast';
import { SearchBar } from '../components/SearchBar';
import { WeatherStats } from '../components/WeatherStats';
import { CONDITION_GRADIENTS, NIGHT_GRADIENT } from '../constants/theme';
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
    setRefreshKey(prev => prev + 1);
  };

  const gradient = weather.data
    ? CONDITION_GRADIENTS[getWMO(weather.data.current.weather_code).condition]
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
              <Text className="text-white/60 mt-4">Fetching your weather...</Text>
            </View>
          ) : location.error ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <Text className="text-white text-center">{location.error}</Text>
            </View>
          ) : weather.error ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <Text className="text-white text-center">{weather.error}</Text>
            </View>
          ) : weather.data ? (
            <View style={{ gap: 16 }}>
              <CurrentWeather data={weather.data.current} cityName={location.cityName ?? ''} />
              <WeatherStats data={weather.data.current} />
              <HourlyForecast data={weather.data.hourly} />
              <DailyForecast data={weather.data.daily} />
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
