import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import i18n, { resolveLocale } from '../i18n';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import './globals.css';

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B1220',
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 8 }}>
        {i18n.t('errorBoundary.title')}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        {error.message}
      </Text>
      <TouchableOpacity
        onPress={retry}
        accessibilityRole="button"
        accessibilityLabel={i18n.t('errorBoundary.tryAgain')}
        style={{
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: '#7c3aed',
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {i18n.t('errorBoundary.tryAgain')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

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

export default function RootLayout() {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const setRequiresPasswordReset = useAuthStore((state) => state.setRequiresPasswordReset);
  const initialized = useAuthStore((state) => state.initialized);
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(resolveLocale(language));
  }, [language]);

  useEffect(() => {
    async function processUrl(url: string | null) {
      if (!url) return;
      try {
        const hash = url.split('#')[1];
        if (!hash) return;
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        if (accessToken && refreshToken) {
          // Set flag before setSession so onAuthStateChange sees it correctly
          if (type === 'recovery') setRequiresPasswordReset(true);
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          // If token was expired, clear the flag so user isn't trapped on /reset-password
          if (error && type === 'recovery') setRequiresPasswordReset(false);
        }
      } catch {}
    }

    // Handle cold-start deep link
    Linking.getInitialURL()
      .then(processUrl)
      .catch(() => {});

    // Handle deep link while app is open
    const linkSub = Linking.addEventListener('url', ({ url }) => processUrl(url));

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT') setRequiresPasswordReset(false);
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
