import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { getWMO } from '../constants/wmo';
import type { HourlyWeather } from '../services/weather';
import { GlassCard } from './GlassCard';

interface HourlyForecastProps {
  data: HourlyWeather;
}

function formatHour(timeStr: string): string {
  const h = parseInt(timeStr.split('T')[1]?.split(':')[0] ?? '0', 10);
  if (h === 0) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  const nowHour = new Date().getHours();
  const hasHourlyData = Array.isArray(data.time) && data.time.length > 0;

  if (!hasHourlyData) {
    return (
      <GlassCard className="p-3">
        <Text className="mb-3 px-1 text-sm font-medium text-white/70">Hourly Forecast</Text>

        <View className="items-center py-6">
          <Text className="text-sm text-white/60">No forecast available</Text>
        </View>
      </GlassCard>
    );
  }
  const startIndex = data.time.findIndex((t) => {
    const h = parseInt(t.split('T')[1]?.split(':')[0] ?? '0', 10);
    return h >= nowHour;
  });

  const from = startIndex >= 0 ? startIndex : 0;
  const hours = data.time.slice(from, from + 24);

  return (
    <GlassCard className="p-3">
      <Text className="mb-3 px-1 text-sm font-medium text-white/70">Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hours.map((time, i) => {
          const index = from + i;
          const wmo = getWMO(data.weather_code[index]);
          return (
            <View key={time} className="mx-3 items-center">
              <Text className="mb-2 text-xs text-white/60">{formatHour(time)}</Text>
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
