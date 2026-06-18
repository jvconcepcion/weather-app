import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import './globals.css';

export default function RootLayout() {
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
