import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { CurrentWeather } from '../services/weather';
import { GlassCard } from './GlassCard';

interface WeatherStatsProps {
  data: CurrentWeather;
  sunrise?: string;
  sunset?: string;
}

const getWindDirection = (degrees?: number | null) => {
  if (typeof degrees !== 'number' || !Number.isFinite(degrees)) return '';

  const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return DIRECTIONS[index];
};

const formatTime = (time?: string) => {
  if (!time) return 'N/A';

  const parsedDate = new Date(time);

  if (Number.isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export function WeatherStats({ data, sunrise, sunset }: WeatherStatsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      key: 'relative_humidity_2m' as const,
      icon: 'water-percent' as const,
      label: t('weather.humidity'),
      format: (v?: number | null) => (typeof v === 'number' && Number.isFinite(v) ? `${v}%` : '--'),
    },
    {
      key: 'wind_speed_10m' as const,
      icon: 'weather-windy' as const,
      label: t('weather.wind'),
      format: (v?: number | null, d?: CurrentWeather) =>
        typeof v === 'number' && Number.isFinite(v)
          ? `${Math.round(v)} km/h ${getWindDirection(d?.wind_direction_10m)}`.trim()
          : '--',
    },
    {
      key: 'precipitation' as const,
      icon: 'umbrella-outline' as const,
      label: t('weather.precip'),
      format: (v?: number | null) =>
        typeof v === 'number' && Number.isFinite(v) ? `${v} mm` : '--',
    },
    {
      key: 'uv_index' as const,
      icon: 'white-balance-sunny' as const,
      label: t('weather.uvIndex'),
      format: (v?: number | null) =>
        typeof v === 'number' && Number.isFinite(v) ? String(Math.round(v)) : '--',
    },
  ];

  return (
    <GlassCard className="p-4">
      <View className="w-full flex-row justify-between">
        {stats.map((stat) => (
          <View key={stat.key} className="flex-1 items-center">
            <MaterialCommunityIcons name={stat.icon} size={22} color="rgba(255,255,255,0.8)" />
            <Text className="mt-1 font-semibold text-white">
              {stat.format(data[stat.key], data)}
            </Text>
            <Text className="mt-0.5 text-xs text-white/60">{stat.label}</Text>
          </View>
        ))}
      </View>

      <View className="mt-4 flex-row justify-center border-t border-white/10 pt-4">
        <View className="flex-1 items-center">
          <MaterialCommunityIcons
            name="weather-sunset-up"
            size={22}
            color="rgba(255,255,255,0.8)"
          />
          <Text className="mt-1 font-semibold text-white">{formatTime(sunrise)}</Text>
          <Text className="mt-0.5 text-xs text-white/60">{t('weather.sunrise')}</Text>
        </View>

        <View className="flex-1 items-center">
          <MaterialCommunityIcons
            name="weather-sunset-down"
            size={22}
            color="rgba(255,255,255,0.8)"
          />
          <Text className="mt-1 font-semibold text-white">{formatTime(sunset)}</Text>
          <Text className="mt-0.5 text-xs text-white/60">{t('weather.sunset')}</Text>
        </View>
      </View>
    </GlassCard>
  );
}
