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
  const startIndex = data.time.findIndex(t => {
    const h = parseInt(t.split('T')[1]?.split(':')[0] ?? '0', 10);
    return h >= nowHour;
  });
  const from = startIndex >= 0 ? startIndex : 0;
  const hours = data.time.slice(from, from + 24);

  return (
    <GlassCard className="p-3">
      <Text className="text-white/70 text-sm font-medium mb-3 px-1">Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hours.map((time, i) => {
          const index = from + i;
          const wmo = getWMO(data.weather_code[index]);
          return (
            <View key={time} className="items-center mx-3">
              <Text className="text-white/60 text-xs mb-2">{formatHour(time)}</Text>
              <MaterialCommunityIcons name={wmo.icon as any} size={24} color="white" />
              <Text className="text-white font-semibold mt-2 text-sm">
                {Math.round(data.temperature_2m[index])}°
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </GlassCard>
  );
}
