import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { getWMO } from '../constants/wmo';
import type { HourlyWeather } from '../services/weather';
import { GlassCard } from './GlassCard';

interface HourlyForecastProps {
  data: HourlyWeather;
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  const { t, i18n } = useTranslation();
  const nowHour = new Date().getHours();
  const hasHourlyData = Array.isArray(data.time) && data.time.length > 0;

  if (!hasHourlyData) {
    return (
      <GlassCard className="p-3">
        <Text className="mb-3 px-1 text-sm font-medium text-white/70">
          {t('weather.hourlyForecast')}
        </Text>

        <View className="items-center py-6">
          <Text className="text-sm text-white/60">{t('weather.noForecastAvailable')}</Text>
        </View>
      </GlassCard>
    );
  }
  const startIndex = data.time.findIndex((time) => {
    const h = parseInt(time.split('T')[1]?.split(':')[0] ?? '0', 10);
    return h >= nowHour;
  });

  const from = startIndex >= 0 ? startIndex : 0;
  const hours = data.time.slice(from, from + 24);

  return (
    <GlassCard className="p-3">
      <Text className="mb-3 px-1 text-sm font-medium text-white/70">
        {t('weather.hourlyForecast')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hours.map((time, i) => {
          const index = from + i;
          const wmo = getWMO(data.weather_code[index]);
          const hourLabel = new Intl.DateTimeFormat(i18n.language, {
            hour: 'numeric',
            hour12: true,
          }).format(new Date(time));
          return (
            <View key={time} className="mx-3 items-center">
              <Text className="mb-2 text-xs text-white/60">{hourLabel}</Text>
              <MaterialCommunityIcons name={wmo.icon} size={24} color="white" />
              <Text className="mt-2 text-sm font-semibold text-white">
                {Math.round(data.temperature_2m[index])}°
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </GlassCard>
  );
}
