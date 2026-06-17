import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { getWMO } from '../constants/wmo';
import type { CurrentWeather as CurrentWeatherData } from '../services/weather';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  cityName: string;
}

export function CurrentWeather({ data, cityName }: CurrentWeatherProps) {
  const wmo = getWMO(data.weather_code);

  return (
    <View className="items-center py-8">
      <Text className="text-lg font-medium text-white/80">{cityName}</Text>
      <MaterialCommunityIcons
        name={wmo.icon as any}
        size={100}
        color="white"
        style={{ marginVertical: 16 }}
      />
      <Text className="font-bold text-white" style={{ fontSize: 80, lineHeight: 88 }}>
        {Math.round(data.temperature_2m)}°
      </Text>
      <Text className="mt-2 text-xl text-white/80">{wmo.label}</Text>
      <Text className="mt-1 text-base text-white/60">
        Feels like {Math.round(data.apparent_temperature)}°
      </Text>
    </View>
  );
}
