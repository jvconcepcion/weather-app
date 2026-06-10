import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { CurrentWeather } from '../services/weather';
import { GlassCard } from './GlassCard';

interface WeatherStatsProps {
  data: CurrentWeather;
}

const STATS = [
  { key: 'relative_humidity_2m', icon: 'water-percent',        label: 'Humidity', format: (v: number) => `${v}%` },
  { key: 'wind_speed_10m',       icon: 'weather-windy',         label: 'Wind',    format: (v: number) => `${Math.round(v)} km/h` },
  { key: 'precipitation',        icon: 'umbrella-outline',      label: 'Precip.', format: (v: number) => `${v} mm` },
  { key: 'uv_index',             icon: 'white-balance-sunny',   label: 'UV Index',format: (v: number) => String(Math.round(v)) },
] as const;

export function WeatherStats({ data }: WeatherStatsProps) {
  return (
    <GlassCard className="flex-row justify-between">
      {STATS.map(stat => (
        <View key={stat.label} className="items-center flex-1">
          <MaterialCommunityIcons name={stat.icon} size={22} color="rgba(255,255,255,0.8)" />
          <Text className="text-white font-semibold mt-1">
            {stat.format(data[stat.key])}
          </Text>
          <Text className="text-white/60 text-xs mt-0.5">{stat.label}</Text>
        </View>
      ))}
    </GlassCard>
  );
}
