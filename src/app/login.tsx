import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { signInWithGoogle } from '../lib/googleSignIn';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setGuest = useAuthStore((state) => state.setGuest);
  const { isTablet } = useBreakpoint();

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
    setLoading(false);
  }

  function handleContinueAsGuest() {
    setGuest(true);
  }

  return (
    <View className="flex-1 bg-[#0B1220]">
      <SafeAreaView className="flex-1 items-center justify-center px-8">
        <View style={{ width: '100%', maxWidth: isTablet ? 400 : undefined }}>
          <MaterialCommunityIcons
            name="weather-partly-cloudy"
            size={isTablet ? 96 : 72}
            color="#7c3aed"
            style={{ alignSelf: 'center' }}
          />

          <Text className="mb-10 mt-2.5 text-center text-[28px] font-bold text-white">
            Weather App
          </Text>

          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.85}
            className="w-full flex-row items-center justify-center gap-3 rounded-[14px] bg-white px-6 py-[15px]"
          >
            {loading ? (
              <ActivityIndicator color="#1a1a2e" />
            ) : (
              <>
                <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
                <Text className="text-base font-semibold text-[#1a1a2e]">Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {error ? <Text className="mt-5 text-center text-xs text-red-400">{error}</Text> : null}

          <TouchableOpacity onPress={handleContinueAsGuest} className="mt-6 items-center">
            <Text className="text-sm text-slate-500">Continue as guest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
