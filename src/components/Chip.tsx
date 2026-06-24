import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type IconType = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ChipProps {
  iconType?: IconType;
  title?: string;
  onPress: () => void;
  onActionPress: () => void;
}

export function Chip({ iconType = 'close', title = '', onPress, onActionPress }: ChipProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingLeft: 14,
          paddingRight: 7,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{title}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onActionPress}
        style={{
          paddingLeft: 6,
          paddingRight: 12,
          paddingVertical: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons name={iconType} size={14} color="rgba(255, 255, 255, 0.85)" />
      </TouchableOpacity>
    </View>
  );
}
