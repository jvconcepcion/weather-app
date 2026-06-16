import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { CurrentWeather } from '../services/weather';
import { GlassCard } from './GlassCard';

interface WeatherStatsProps {
  data: CurrentWeather;
  sunrise?: string;
  sunset?: string;
}

const getWindDirection = (degrees?: number) => {
  if (degrees == null) return "";

  const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return DIRECTIONS[index];
};

const STATS = [
  { 
    key: 'relative_humidity_2m', 
    icon: 'water-percent',        
    label: 'Humidity', 
    format: (v: number) => `${v}%`
  },
  { 
    key: 'wind_speed_10m',       
    icon: 'weather-windy',         
    label: 'Wind',    
    format: (v: number, data: CurrentWeather) => `${Math.round(v)} km/h ${getWindDirection(data.wind_direction_10m)}`
  },
  { 
    key: 'precipitation',        
    icon: 'umbrella-outline',      
    label: 'Precip.', 
    format: (v: number) => `${v} mm`
  },
  { 
    key: 'uv_index',             
    icon: 'white-balance-sunny',   
    label: 'UV Index',
    format: (v: number) => String(Math.round(v)) 
  },
] as const;

const formatTime = (time?: string) => {
  if (!time) return "--:--";

  return new Date(time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export function WeatherStats({ data, sunrise, sunset }: WeatherStatsProps) {
  return (
    <GlassCard className="p-4">
      <View className="flex-row justify-between w-full">
        {STATS.map(stat => (
          <View key={stat.label} className="items-center flex-1">
            <MaterialCommunityIcons name={stat.icon} size={22} color="rgba(255,255,255,0.8)" />
            <Text className="text-white font-semibold mt-1">
              {stat.format(data[stat.key], data)}
            </Text>
            <Text className="text-white/60 text-xs mt-0.5">{stat.label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row justify-center mt-4 pt-4 border-t border-white/10">
        <View className="items-center flex-1">
          <MaterialCommunityIcons
            name="weather-sunset-up"
            size={22}
            color="rgba(255,255,255,0.8)"
          />
          <Text className="text-white font-semibold mt-1">{formatTime(sunrise)}</Text>
          <Text className="text-white/60 text-xs mt-0.5">Sunrise</Text>
        </View>

        <View className="items-center flex-1">
          <MaterialCommunityIcons
            name="weather-sunset-down"
            size={22}
            color="rgba(255,255,255,0.8)"
          />
          <Text className="text-white font-semibold mt-1">{formatTime(sunset)}</Text>
          <Text className="text-white/60 text-xs mt-0.5">Sunset</Text>
        </View>
      </View>
    </GlassCard>
  );
}
