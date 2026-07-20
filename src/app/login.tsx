import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AuthInput } from '../components/AuthInput';
import { AuthModeTabs } from '../components/AuthModeTabs';
import { ForgotHeader } from '../components/ForgotHeader';
import { ScreenContainer } from '../components/ScreenContainer';
import { SocialSignIn } from '../components/SocialSignIn';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginScreen() {
  const { t } = useTranslation();
  const {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    googleLoading,
    error,
    successMsg,
    switchMode,
    handleSubmit,
    handleGoogleSignIn,
    primaryLabel,
    setGuest,
  } = useLoginForm();
  const { isTablet } = useBreakpoint();

  return (
    <ScreenContainer>
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
            <View className="mb-8 items-center">
              <MaterialCommunityIcons
                name="weather-partly-cloudy"
                size={isTablet ? 88 : 68}
                color="#7c3aed"
              />
              <Text className="mt-3 text-[26px] font-bold text-white">{t('auth.appName')}</Text>
            </View>

            {mode !== 'forgot' ? (
              <AuthModeTabs mode={mode} onSwitch={switchMode} />
            ) : (
              <ForgotHeader onBack={() => switchMode('signin')} />
            )}

            <View className="gap-3">
              <AuthInput
                icon="email-outline"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {mode !== 'forgot' && (
                <AuthInput
                  icon="lock-outline"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              )}
              {mode === 'signup' && (
                <AuthInput
                  icon="lock-check-outline"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              )}
            </View>

            {mode === 'signin' && (
              <TouchableOpacity onPress={() => switchMode('forgot')} className="mt-2.5 self-end">
                <Text className="text-xs text-violet-400">{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>
            )}

            {error ? (
              <Text className="mt-3 text-center text-xs text-red-400">{error}</Text>
            ) : successMsg ? (
              <Text className="mt-3 text-center text-xs text-emerald-400">{successMsg}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading || googleLoading}
              activeOpacity={0.85}
              className="mt-5 items-center justify-center rounded-2xl bg-violet-600 py-[15px]"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-[15px] font-semibold text-white">{primaryLabel}</Text>
              )}
            </TouchableOpacity>

            {mode !== 'forgot' && (
              <SocialSignIn
                googleLoading={googleLoading}
                disabled={loading || googleLoading}
                onGoogleSignIn={handleGoogleSignIn}
                onGuestSignIn={() => setGuest(true)}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
