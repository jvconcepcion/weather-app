import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentWeather } from '../../components/CurrentWeather';
import { DailyForecast } from '../../components/DailyForecast';
import { HourlyForecast } from '../../components/HourlyForecast';
import { WeatherStats } from '../../components/WeatherStats';
import { CONDITION_GRADIENTS, NIGHT_GRADIENT } from '../../constants/theme';
import { getWMO } from '../../constants/wmo';
import { useWeather } from '../../hooks/useWeather';

export default function LocationScreen() {
  const router = useRouter();
  const { name, lat, lon } = useLocalSearchParams<{ name: string; lat: string; lon: string }>();
  const latitude = parseFloat(lat ?? '');
  const longitude = parseFloat(lon ?? '');
  const weather = useWeather(
    isNaN(latitude) ? null : latitude,
    isNaN(longitude) ? null : longitude,
  );

  const gradient = weather.data
    ? CONDITION_GRADIENTS[getWMO(weather.data.current.weather_code).condition]
    : NIGHT_GRADIENT;

  return (
    <LinearGradient colors={gradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold ml-4">{name}</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          {weather.loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <ActivityIndicator size="large" color="white" />
              <Text className="text-white/60 mt-4">Fetching weather...</Text>
            </View>
          ) : weather.error ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <Text className="text-white text-center">{weather.error}</Text>
            </View>
          ) : weather.data ? (
            <View style={{ gap: 16, marginTop: 8 }}>
              <CurrentWeather data={weather.data.current} cityName={name ?? ''} />
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
