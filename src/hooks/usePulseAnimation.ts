import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type UsePulseAnimationOptions = {
  from?: number;
  to?: number;
  duration?: number;
};

export function usePulseAnimation({
  from = 0.45,
  to = 0.8,
  duration = 800,
}: UsePulseAnimationOptions = {}) {
  const pulse = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: to,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: from,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse, from, to, duration]);

  return pulse;
}
