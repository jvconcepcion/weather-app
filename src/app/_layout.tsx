import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useAuthStore } from '../store/useAuthStore';
import './globals.css';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function useProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const initialized = useAuthStore((state) => state.initialized);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const onLoginScreen = segments[0] === 'login';
    const isAuthenticated = !!user || isGuest;

    if (!isAuthenticated && !onLoginScreen) {
      router.replace('/login');
    } else if (isAuthenticated && onLoginScreen) {
      router.replace('/');
    }
  }, [user, isGuest, initialized, segments, router]);
}

export default function RootLayout() {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setInitialized]);

  useProtectedRoute();
  usePushNotifications();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B1220' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: '#0B1220' } }} />
      <Stack.Screen
        name="location/[id]"
        options={{ animation: Platform.OS === 'ios' ? 'ios_from_right' : 'slide_from_right' }}
      />
    </Stack>
  );
}
