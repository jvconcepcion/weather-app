import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';

// Landing view for weatherapp://auth/callback deep link.
// if nothing happens in 5s (expired/invalid link), send to login.
export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/login'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    </ScreenContainer>
  );
}
