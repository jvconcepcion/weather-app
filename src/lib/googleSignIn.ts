import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from './supabase';

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    if (!idToken) {
      return { error: 'No ID token received from Google.' };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: String(err) };
  }
}

export async function signOut(): Promise<void> {
  await GoogleSignin.signOut();
  await supabase.auth.signOut();
}
