import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthInput } from '../components/AuthInput';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { updatePassword } from '../lib/emailAuth';
import { useAuthStore } from '../store/useAuthStore';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const setRequiresPasswordReset = useAuthStore((state) => state.setRequiresPasswordReset);
  const { isTablet } = useBreakpoint();

  async function handleUpdate() {
    setError(null);

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    setDone(true);
  }

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setRequiresPasswordReset(false), 1500);
    return () => clearTimeout(timer);
  }, [done, setRequiresPasswordReset]);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center justify-center px-8"
      >
        <View style={{ width: '100%', maxWidth: isTablet ? 400 : undefined }}>
          {done ? (
            <View className="items-center gap-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <MaterialCommunityIcons name="check-circle-outline" size={40} color="#34d399" />
              </View>
              <Text className="text-center text-xl font-bold text-white">Password updated!</Text>
              <Text className="text-center text-sm text-slate-400">
                Taking you back to the app…
              </Text>
            </View>
          ) : (
            <>
              <View className="mb-8 items-center gap-3">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-violet-600/10">
                  <MaterialCommunityIcons name="lock-reset" size={36} color="#7c3aed" />
                </View>
                <Text className="text-2xl font-bold text-white">Set new password</Text>
                <Text className="text-center text-sm text-slate-400">
                  Choose a strong password for your account.
                </Text>
              </View>

              <View className="gap-3">
                <AuthInput
                  icon="lock-outline"
                  placeholder="New password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <AuthInput
                  icon="lock-check-outline"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {error ? (
                <Text className="mt-3 text-center text-xs text-red-400">{error}</Text>
              ) : null}

              <TouchableOpacity
                onPress={handleUpdate}
                disabled={loading}
                activeOpacity={0.85}
                className="mt-5 items-center justify-center rounded-2xl bg-violet-600 py-[15px]"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-[15px] font-semibold text-white">Update password</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
