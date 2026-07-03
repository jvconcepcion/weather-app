import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '../components/AuthInput';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { sendPasswordReset, signInWithEmail, signUpWithEmail } from '../lib/emailAuth';
import { signInWithGoogle } from '../lib/googleSignIn';
import { useAuthStore } from '../store/useAuthStore';

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const setGuest = useAuthStore((state) => state.setGuest);
  const { isTablet } = useBreakpoint();

  function switchMode(next: AuthMode) {
    setMode(next);
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit() {
    setError(null);
    setSuccessMsg(null);
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email.');
      return;
    }

    if (mode === 'forgot') {
      setLoading(true);
      const { error } = await sendPasswordReset(trimmedEmail);
      setLoading(false);
      if (error) {
        setError(error);
        return;
      }
      setSuccessMsg('Reset link sent — check your inbox.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setLoading(true);
      const { error } = await signUpWithEmail(trimmedEmail, password);
      setLoading(false);
      if (error === 'confirm_email') {
        setSuccessMsg('Account created! Check your email to confirm before signing in.');
        return;
      }
      if (error) {
        setError(error);
        return;
      }
      return;
    }

    setLoading(true);
    const { error } = await signInWithEmail(trimmedEmail, password);
    setLoading(false);
    if (error) setError(error);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
    setGoogleLoading(false);
  }

  const primaryLabel =
    mode === 'forgot' ? 'Send reset link' : mode === 'signup' ? 'Create account' : 'Sign in';

  return (
    <View className="flex-1 bg-[#0B1220]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 32,
              paddingVertical: 24,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{ width: '100%', maxWidth: isTablet ? 400 : undefined, alignSelf: 'center' }}
            >
              {/* Header */}
              <View className="mb-8 items-center">
                <MaterialCommunityIcons
                  name="weather-partly-cloudy"
                  size={isTablet ? 88 : 68}
                  color="#7c3aed"
                />
                <Text className="mt-3 text-[26px] font-bold text-white">Weather App</Text>
              </View>

              {/* Tabs (hidden in forgot mode) */}
              {mode !== 'forgot' && (
                <View className="mb-6 flex-row rounded-2xl border border-white/10 bg-white/[0.05] p-1">
                  {(['signin', 'signup'] as const).map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => switchMode(tab)}
                      activeOpacity={0.8}
                      className={`flex-1 items-center rounded-xl py-2.5 ${mode === tab ? 'bg-violet-600' : ''}`}
                    >
                      <Text
                        className={`text-[14px] font-semibold ${mode === tab ? 'text-white' : 'text-white/50'}`}
                      >
                        {tab === 'signin' ? 'Sign in' : 'Sign up'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Forgot password header */}
              {mode === 'forgot' && (
                <View className="mb-6">
                  <TouchableOpacity
                    onPress={() => switchMode('signin')}
                    className="mb-4 flex-row items-center gap-1.5"
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={18}
                      color="rgba(255,255,255,0.6)"
                    />
                    <Text className="text-sm text-white/60">Back to sign in</Text>
                  </TouchableOpacity>
                  <Text className="text-xl font-bold text-white">Reset password</Text>
                  <Text className="mt-1 text-sm text-slate-400">
                    Use your account email to reset your password.
                  </Text>
                </View>
              )}

              {/* Fields */}
              <View className="gap-3">
                <AuthInput
                  icon="email-outline"
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                {mode !== 'forgot' && (
                  <AuthInput
                    icon="lock-outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                )}

                {mode === 'signup' && (
                  <AuthInput
                    icon="lock-check-outline"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                )}
              </View>

              {mode === 'signin' && (
                <TouchableOpacity onPress={() => switchMode('forgot')} className="mt-2.5 self-end">
                  <Text className="text-xs text-violet-400">Forgot password?</Text>
                </TouchableOpacity>
              )}

              {error ? (
                <Text className="mt-3 text-center text-xs text-red-400">{error}</Text>
              ) : successMsg ? (
                <Text className="mt-3 text-center text-xs text-emerald-400">{successMsg}</Text>
              ) : null}

              {/* Primary button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
                className="mt-5 items-center justify-center rounded-2xl bg-violet-600 py-[15px]"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-[15px] font-semibold text-white">{primaryLabel}</Text>
                )}
              </TouchableOpacity>

              {/* Divider and Google (hidden in forgot mode) */}
              {mode !== 'forgot' && (
                <>
                  <View className="my-6 flex-row items-center gap-3">
                    <View className="h-px flex-1 bg-white/10" />
                    <Text className="text-xs text-white/30">or</Text>
                    <View className="h-px flex-1 bg-white/10" />
                  </View>

                  <TouchableOpacity
                    onPress={handleGoogleSignIn}
                    disabled={googleLoading}
                    activeOpacity={0.85}
                    className="flex-row items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] py-[15px]"
                  >
                    {googleLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
                        <Text className="text-[15px] font-medium text-white">
                          Continue with Google
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setGuest(true)} className="mt-5 items-center">
                    <Text className="text-sm text-slate-500">Continue as guest</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
