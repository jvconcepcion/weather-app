import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendPasswordReset, signInWithEmail, signUpWithEmail } from '../lib/emailAuth';
import { signInWithGoogle } from '../lib/googleSignIn';
import { useAuthStore } from '../store/useAuthStore';

export type AuthMode = 'signin' | 'signup' | 'forgot';

export function useLoginForm() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const setGuest = useAuthStore((state) => state.setGuest);

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
      setError(t('auth.errors.emailRequired'));
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
      setSuccessMsg(t('auth.success.resetLinkSent'));
      return;
    }

    if (!password) {
      setError(t('auth.errors.passwordRequired'));
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError(t('auth.errors.passwordsDoNotMatch'));
        return;
      }
      setLoading(true);
      const { error } = await signUpWithEmail(trimmedEmail, password);
      setLoading(false);
      if (error === 'confirm_email') {
        setSuccessMsg(t('auth.success.accountCreated'));
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
    mode === 'forgot'
      ? t('auth.sendResetLink')
      : mode === 'signup'
        ? t('auth.createAccount')
        : t('auth.signIn');

  return {
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
  };
}
