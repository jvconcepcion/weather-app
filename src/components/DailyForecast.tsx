import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { getWMO } from '../constants/wmo';
import type { DailyWeather } from '../services/weather';
import { GlassCard } from './GlassCard';

interface DailyForecastProps {
  data: DailyWeather;
}

export function DailyForecast({ data }: DailyForecastProps) {
  const { t, i18n } = useTranslation();
  const hasDailyData = Array.isArray(data.time) && data.time.length > 0;

  if (!hasDailyData) {
    return (
      <GlassCard>
        <Text className="mb-1 text-sm font-medium text-white/70">{t('weather.dailyForecast')}</Text>

        <View className="items-center py-6">
          <Text className="text-sm text-white/60">{t('weather.noForecastAvailable')}</Text>
        </View>
      </GlassCard>
    );
  }
  return (
    <GlassCard>
      <Text className="mb-1 text-sm font-medium text-white/70">{t('weather.dailyForecast')}</Text>
      {data.time.map((time, i) => {
        const date = new Date(`${time}T00:00:00`);
        const dayName =
          i === 0
            ? t('weather.today')
            : new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(date);
        const wmo = getWMO(data.weather_code[i]);
        const isLast = i === data.time.length - 1;

        return (
          <View
            key={time}
            className={`flex-row items-center py-3 ${!isLast ? 'border-b border-white/10' : ''}`}
          >
            <Text className="w-14 font-medium text-white/80">{dayName}</Text>
            <MaterialCommunityIcons name={wmo.icon} size={22} color="rgba(255,255,255,0.75)" />
            <Text className="ml-auto mr-3 text-sm text-white/50">
              {Math.round(data.temperature_2m_min[i])}°
            </Text>
            <Text className="w-8 text-right font-semibold text-white">
              {Math.round(data.temperature_2m_max[i])}°
            </Text>
          </View>
        );
      })}
    </GlassCard>
  );
}
