import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import './globals.css';

SplashScreen.preventAutoHideAsync();

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
  const requiresPasswordReset = useAuthStore((state) => state.requiresPasswordReset);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const seg = segments[0] as string;
    const onLoginScreen = seg === 'login';
    const onResetScreen = seg === 'reset-password';
    const onCallbackScreen = seg === 'auth';
    const isAuthenticated = !!user || isGuest;

    if (requiresPasswordReset && !onResetScreen) {
      router.replace('/reset-password' as never);
    } else if (!isAuthenticated && !onLoginScreen && !onResetScreen && !onCallbackScreen) {
      router.replace('/login');
    } else if (isAuthenticated && (onLoginScreen || onCallbackScreen) && !requiresPasswordReset) {
      router.replace('/');
    }
  }, [user, isGuest, initialized, requiresPasswordReset, segments, router]);
}

export default function RootLayout() {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const setRequiresPasswordReset = useAuthStore((state) => state.setRequiresPasswordReset);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    async function processUrl(url: string | null) {
      if (!url) return;
      const hash = url.split('#')[1];
      if (!hash) return;
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (type === 'recovery') {
          setRequiresPasswordReset(true);
        }
      }
    }

    // Handle cold-start deep link
    Linking.getInitialURL().then(processUrl);

    // Handle deep link while app is open
    const linkSub = Linking.addEventListener('url', ({ url }) => processUrl(url));

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      linkSub.remove();
    };
  }, [setSession, setInitialized, setRequiresPasswordReset]);

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  useProtectedRoute();
  usePushNotifications();
  useSupabaseSync();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B1220' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: '#0B1220' } }} />
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="auth/callback" options={{ animation: 'none' }} />
      <Stack.Screen name="reset-password" options={{ animation: 'fade' }} />
      <Stack.Screen
        name="location/[id]"
        options={{ animation: Platform.OS === 'ios' ? 'ios_from_right' : 'slide_from_right' }}
      />
    </Stack>
  );
}
