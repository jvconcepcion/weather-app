import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { usePushNotifications } from '../hooks/usePushNotifications';
import './globals.css';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
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
