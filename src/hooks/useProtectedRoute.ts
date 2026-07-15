import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function useProtectedRoute() {
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
    } else if (
      isAuthenticated &&
      (onLoginScreen || onCallbackScreen || onResetScreen) &&
      !requiresPasswordReset
    ) {
      router.replace('/');
    }
  }, [user, isGuest, initialized, requiresPasswordReset, segments, router]);
}
