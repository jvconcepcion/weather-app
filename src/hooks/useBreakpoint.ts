import { useWindowDimensions } from 'react-native';

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    isTablet: width >= 768,
    width,
  };
}
