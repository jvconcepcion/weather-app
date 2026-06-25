import { WeatherSkeleton } from '@/components/WeatherSkeleton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentWeather } from '../../components/CurrentWeather';
import { DailyForecast } from '../../components/DailyForecast';
import { HourlyForecast } from '../../components/HourlyForecast';
import { PageHeader } from '../../components/PageHeader';
import { WeatherStats } from '../../components/WeatherStats';
import { getGradient, NIGHT_GRADIENT } from '../../constants/theme';
import { getWMO } from '../../constants/wmo';
import { useWeather } from '../../hooks/useWeather';
import { useAppStore, type City } from '../../store/useAppStore';

export default function LocationScreen() {
  const router = useRouter();
  const favorites = useAppStore((state) => state.favorites);
  const addFavorites = useAppStore((state) => state.addFavorite);
  const removeFavorites = useAppStore((state) => state.removeFavorite);
  const addRecentSearch = useAppStore((state) => state.addRecentSearch);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { id, name, lat, lon } = useLocalSearchParams<{
    id: string;
    name: string;
    lat: string;
    lon: string;
  }>();
  const latitude = parseFloat(lat ?? '');
  const longitude = parseFloat(lon ?? '');
  const cityId = Number(id);
  const parsedLat = Number(latitude);
  const parsedLon = Number(longitude);

  const isInvalidLocation =
    Number.isNaN(cityId) || !Number.isFinite(parsedLat) || !Number.isFinite(parsedLon);

  const currentCity: City = {
    id: cityId,
    name: name ?? '',
    lat: parsedLat,
    lon: parsedLon,
  };

  const isFavorite =
    !isInvalidLocation && favorites.some((city) => String(city.id) === String(cityId));

  const weather = useWeather(
    isInvalidLocation ? null : parsedLat,
    isInvalidLocation ? null : parsedLon,
    refreshKey,
  );
  const weatherCode = weather.data?.current?.weather_code ?? 0;
  const sunrise = weather.data?.daily?.sunrise?.[0];
  const sunset = weather.data?.daily?.sunset?.[0];

  async function handleRefresh() {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
  }

  function handleToggleFavorite() {
    if (isInvalidLocation) return;

    if (isFavorite) {
      removeFavorites(cityId);
      return;
    }

    addFavorites(currentCity);
  }

  const gradient =
    weather.data && sunrise && sunset
      ? getGradient(getWMO(weatherCode).condition, sunrise, sunset)
      : NIGHT_GRADIENT;

  useEffect(() => {
    if (!weather.loading) {
      setIsRefreshing(false);
    }
  }, [weather.loading]);

  useEffect(() => {
    if (weather.loading || isInvalidLocation) return;

    addRecentSearch({
      id: cityId,
      name,
      lat: parsedLat,
      lon: parsedLon,
    } satisfies City);
  }, [weather.loading, isInvalidLocation, cityId, name, parsedLat, parsedLon, addRecentSearch]);

  if (isInvalidLocation) {
    return (
      <LinearGradient colors={NIGHT_GRADIENT} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <PageHeader title="Location" />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
            }}
          >
            <Text className="text-center text-white">Location not found</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 12,
          }}
        >
          <PageHeader title={name ?? 'Location'} />
          <TouchableOpacity onPress={handleToggleFavorite} hitSlop={10}>
            <MaterialCommunityIcons
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? '#FFD700' : 'white'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="white" />
          }
        >
          {weather.loading ? (
            <WeatherSkeleton />
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
