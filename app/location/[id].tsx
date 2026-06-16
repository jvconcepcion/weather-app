import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentWeather } from '../../components/CurrentWeather';
import { DailyForecast } from '../../components/DailyForecast';
import { HourlyForecast } from '../../components/HourlyForecast';
import { WeatherStats } from '../../components/WeatherStats';
import { getGradient, NIGHT_GRADIENT } from '../../constants/theme';
import { getWMO } from '../../constants/wmo';
import { useWeather } from '../../hooks/useWeather';

export default function LocationScreen() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { name, lat, lon } = useLocalSearchParams<{ name: string; lat: string; lon: string }>();
  const latitude = parseFloat(lat ?? '');
  const longitude = parseFloat(lon ?? '');
  const weather = useWeather(
    isNaN(latitude) ? null : latitude,
    isNaN(longitude) ? null : longitude,
    refreshKey
  );

  async function handleRefresh() {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
  };

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
    };
  }, [weather.loading]);

  return (
    <LinearGradient colors={gradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold ml-4">{name}</Text>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="white" />
          }
        >
          {weather.loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <ActivityIndicator size="large" color="white" />
              <Text className="text-white/60 mt-4">Fetching weather...</Text>
            </View>
          ) : weather.error ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <Text className="text-white text-center">{weather.error}</Text>
              <TouchableOpacity onPress={handleRefresh} className="m-2 border border-white rounded-md px-4 py-2">
                <Text className="text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : weather.data ? (
            <View style={{ gap: 16, marginTop: 8 }}>
              <CurrentWeather data={weather.data.current} cityName={name ?? ''} />
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
