import { Platform } from 'react-native';
import { supabase } from './supabase';

export async function upsertPushToken(userId: string, token: string): Promise<void> {
  await supabase.from('push_tokens').upsert(
    {
      user_id: userId,
      token,
      platform: Platform.OS,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,platform' },
  );
}
