import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { getWMO } from '../constants/wmo';
import type { DailyWeather } from '../services/weather';
import { GlassCard } from './GlassCard';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DailyForecastProps {
  data: DailyWeather;
}

export function DailyForecast({ data }: DailyForecastProps) {
  return (
    <GlassCard>
      <Text className="mb-1 text-sm font-medium text-white/70">8-Day Forecast</Text>
      {data.time.map((time, i) => {
        const date = new Date(`${time}T00:00:00`);
        const dayName = i === 0 ? 'Today' : DAY_NAMES[date.getDay()];
        const wmo = getWMO(data.weather_code[i]);
        const isLast = i === data.time.length - 1;

        return (
          <View
            key={time}
            className={`flex-row items-center py-3 ${!isLast ? 'border-b border-white/10' : ''}`}
          >
            <Text className="w-14 font-medium text-white/80">{dayName}</Text>
            <MaterialCommunityIcons
              name={wmo.icon as any}
              size={22}
              color="rgba(255,255,255,0.75)"
            />
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
