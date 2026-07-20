import { WeatherSkeleton } from '@/components/WeatherSkeleton';
import { triggerLightImpact, triggerSuccessHaptic } from '@/utils/haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from '../components/Chip';
import { CurrentWeather } from '../components/CurrentWeather';
import { DailyForecast } from '../components/DailyForecast';
import { HourlyForecast } from '../components/HourlyForecast';
import { ProfileMenuButton } from '../components/ProfileMenuButton';
import { SearchBar } from '../components/SearchBar';
import { WeatherStats } from '../components/WeatherStats';
import { getGradient, NIGHT_GRADIENT } from '../constants/theme';
import { getWMO } from '../constants/wmo';
import { useLocation } from '../hooks/useLocation';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useWeather } from '../hooks/useWeather';
import { useAppStore, type City } from '../store/useAppStore';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const location = useLocation();
  const { isTablet } = useBreakpoint();
  const weather = useWeather(location.latitude, location.longitude, refreshKey);
  const unit = useAppStore((state) => state.unit);
  const setUnit = useAppStore((state) => state.setUnit);
  const favorites = useAppStore((state) => state.favorites);
  const addFavorite = useAppStore((state) => state.addFavorite);
  const recentSearches = useAppStore((state) => state.recentSearches);
  const clearRecentSearches = useAppStore((state) => state.clearRecentSearches);
  const removeRecentSearch = useAppStore((state) => state.removeRecentSearch);
  const isConnected = useNetworkStatus();

  const weatherCode = weather.data?.current?.weather_code ?? 0;
  const sunrise = weather.data?.daily?.sunrise?.[0];
  const sunset = weather.data?.daily?.sunset?.[0];
  const isCityFavorite = (city: City) =>
    favorites.some((item) => String(item.id) === String(city.id));

  const handleToggleUnit = async () => {
    await triggerLightImpact();
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  async function handleRecentLongPress(city: City) {
    await triggerLightImpact();
    const alreadyFavorite = favorites.some((item) => String(item.id) === String(city.id));
    if (!alreadyFavorite) {
      addFavorite(city);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await triggerSuccessHaptic();
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

  const gradient =
    weather.data && sunrise && sunset
      ? getGradient(getWMO(weatherCode).condition, sunrise, sunset)
      : NIGHT_GRADIENT;

  useEffect(() => {
    if (!weather.loading) {
      setIsRefreshing(false);
    }
  }, [weather.loading]);

  return (
    <LinearGradient colors={gradient} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: isTablet ? 40 : 20,
            paddingBottom: 32,
            maxWidth: isTablet ? 768 : undefined,
            alignSelf: isTablet ? 'center' : undefined,
            width: '100%',
          }}
          ref={scrollViewRef}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="white" />
          }
        >
          <View className="mb-6 mt-6 gap-3">
            <View className="items-end">
              <ProfileMenuButton
                onLoginPress={() => router.push('/login')}
                onSettingsPress={() => router.push('/settings')}
                onAboutPress={() => router.push('/about')}
              />
            </View>
            <View className="flex-row items-center gap-2">
              <View className="flex-1">
                <SearchBar />
              </View>
              <TouchableOpacity
                onPress={handleToggleUnit}
                className="h-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 px-4"
              >
                <Text className="font-medium text-white">{unit === 'celsius' ? '°C' : '°F'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {recentSearches.length > 0 && (
            <Animated.View entering={FadeIn.duration(400)} className="mb-5">
              <View className="mb-2.5 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-white">
                  {t('home.recentSearches')}
                </Text>
                <TouchableOpacity
                  onPress={clearRecentSearches}
                  className="flex-row items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.08] px-2.5 py-1.5"
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={14}
                    color="rgba(255, 255, 255, 0.85)"
                  />
                  <Text className="text-xs font-semibold text-white/85">{t('common.clear')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 24 }}
              >
                {recentSearches.map((city) => (
                  <Chip
                    key={String(city.id)}
                    title={city.name}
                    onPress={() => handleRecentPress(city)}
                    onLongPress={() => handleRecentLongPress(city)}
                    onActionPress={() => removeRecentSearch(city.id)}
                    actionAccessibilityLabel={`Remove ${city.name} from recent searches`}
                    containerStyle={
                      isCityFavorite(city)
                        ? {
                            backgroundColor: 'rgba(245, 158, 11, 0.16)',
                            borderColor: 'rgba(245, 158, 11, 0.32)',
                          }
                        : undefined
                    }
                    actionIconColor={isCityFavorite(city) ? '#FBBF24' : 'rgba(255, 255, 255, 0.85)'}
                  />
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {!isConnected && (
            <View className="mb-4 flex-row items-center rounded-2xl border border-white/20 bg-black/20 px-4 py-3">
              <View className="mr-3 h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <Text className="flex-1 text-sm text-white">
                {t('home.offlineBanner')}{' '}
                <Text className="text-white/80">{t('home.offlineBannerSub')}</Text>
              </Text>
            </View>
          )}

          {location.loading || weather.loading ? (
            <WeatherSkeleton />
          ) : location.error ? (
            <View className="items-center gap-5 px-6 py-16">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-white/10">
                <MaterialCommunityIcons
                  name={location.permissionDenied ? 'map-marker-off-outline' : 'wifi-off'}
                  size={40}
                  color="rgba(255,255,255,0.7)"
                />
              </View>
              <Text className="text-center text-xl font-bold text-white">
                {location.permissionDenied
                  ? t('home.locationAccessNeeded')
                  : t('home.couldNotGetLocation')}
              </Text>
              <Text className="text-center text-sm text-white/60">
                {location.permissionDenied
                  ? t('home.locationPermissionMsg')
                  : t('home.locationErrorMsg')}
              </Text>
              {location.permissionDenied ? (
                <TouchableOpacity
                  onPress={() => Linking.openSettings()}
                  className="rounded-2xl border border-white/20 bg-white/15 px-6 py-3.5"
                >
                  <Text className="font-semibold text-white">{t('home.openSettings')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={location.retry}
                  className="rounded-2xl border border-white/20 bg-white/15 px-6 py-3.5"
                >
                  <Text className="font-semibold text-white">{t('common.tryAgain')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
              >
                <Text className="text-sm text-white/60">{t('home.searchManually')}</Text>
              </TouchableOpacity>
            </View>
          ) : weather.error ? (
            <View className="items-center py-20">
              <Text className="text-center text-white">{weather.error}</Text>
              <TouchableOpacity
                onPress={handleRefresh}
                className="m-2 rounded-md border border-white px-4 py-2"
              >
                <Text className="text-white">{t('common.tryAgain')}</Text>
              </TouchableOpacity>
            </View>
          ) : weather.data ? (
            <View className="gap-4">
              <CurrentWeather
                data={weather.data.current}
                cityName={location.cityName || t('home.currentLocation')}
              />
              <WeatherStats
                data={weather.data.current}
                sunrise={weather.data.daily?.sunrise?.[0]}
                sunset={weather.data.daily?.sunset?.[0]}
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
