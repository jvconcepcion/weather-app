import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type IconType = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ChipProps {
  iconType?: IconType;
  title?: string;
  onPress: () => void;
  onLongPress?: () => void;
  onActionPress: () => void;
  actionAccessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  actionIconColor?: string;
}

export function Chip({
  iconType = 'close',
  title = '',
  onPress,
  onLongPress,
  onActionPress,
  actionAccessibilityLabel,
  containerStyle,
  titleStyle,
  actionIconColor = 'rgba(255, 255, 255, 0.85)',
}: ChipProps) {
  const { t } = useTranslation();
  const resolvedAccessibilityLabel = actionAccessibilityLabel ?? t('chip.remove');
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.14)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.18)',
          overflow: 'hidden',
        },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          paddingLeft: 14,
          paddingRight: 7,
          paddingVertical: 10,
        }}
      >
        <Text style={[{ color: 'white', fontSize: 14, fontWeight: '500' }, titleStyle]}>
          {title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onActionPress}
        accessibilityRole="button"
        accessibilityLabel={resolvedAccessibilityLabel}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          paddingLeft: 6,
          paddingRight: 12,
          paddingVertical: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons name={iconType} size={14} color={actionIconColor} />
      </TouchableOpacity>
    </View>
  );
}
