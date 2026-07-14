import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SCREEN_BG } from '../constants/theme';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  scrollable = false,
  padded = false,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const { isTablet } = useBreakpoint();

  const tabletStyle = padded
    ? {
        paddingHorizontal: isTablet ? 40 : 20,
        paddingBottom: 32,
        maxWidth: isTablet ? 768 : undefined,
        alignSelf: isTablet ? ('center' as const) : undefined,
        width: '100%' as const,
      }
    : undefined;

  return (
    <View style={[{ flex: 1, backgroundColor: SCREEN_BG }, style]}>
      <SafeAreaView style={{ flex: 1 }}>
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[tabletStyle, contentContainerStyle]}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </SafeAreaView>
    </View>
  );
}
