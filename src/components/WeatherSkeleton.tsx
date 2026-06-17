import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

interface WeatherSkeletonProps {
  showHeader?: boolean;
}

function RowSkeleton({ count }: { count: number }) {
  return (
    <View className="flex-row justify-between">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="h-12 w-16 rounded-lg bg-white/10" />
      ))}
    </View>
  );
}

export function WeatherSkeleton({ showHeader = false }: WeatherSkeletonProps) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View style={{ gap: 16, opacity: pulse }}>
      {showHeader && (
        <View className="flex-row items-center justify-between py-2">
          <View className="h-10 w-10 rounded-full bg-white/10" />
          <View className="h-6 w-36 rounded-lg bg-white/10" />
          <View className="h-10 w-10 rounded-full bg-transparent" />
        </View>
      )}

      <View className="items-center py-8">
        <View className="mb-3 h-6 w-28 rounded-lg bg-white/10" />
        <View className="mb-4 h-24 w-24 rounded-full bg-white/10" />
        <View className="mb-3 h-20 w-36 rounded-lg bg-white/10" />
        <View className="mb-2 h-6 w-40 rounded-lg bg-white/10" />
        <View className="h-5 w-28 rounded-lg bg-white/10" />
      </View>

      <View className="rounded-2xl bg-white/10 p-4">
        <RowSkeleton count={4} />
        <View className="mt-4 border-t border-white/10 pt-4">
          <RowSkeleton count={2} />
        </View>
      </View>

      <View className="rounded-2xl bg-white/10 p-4">
        <View className="mb-3 h-4 w-28 rounded-lg bg-white/10" />
        <View className="h-20 rounded-xl bg-white/10" />
      </View>

      <View className="rounded-2xl bg-white/10 p-4">
        <View className="mb-2 h-4 w-32 rounded-lg bg-white/10" />
        <View style={{ gap: 10 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} className="h-10 rounded-lg bg-white/10" />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
