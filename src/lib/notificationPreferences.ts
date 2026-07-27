import { supabase } from './supabase';

export async function fetchNotificationPreferences(
  userId: string,
): Promise<{ dailySummaryEnabled: boolean; preferredHour: number } | null> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('daily_summary_enabled, preferred_hour')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return {
    dailySummaryEnabled: data.daily_summary_enabled,
    preferredHour: data.preferred_hour,
  };
}

export async function upsertNotificationPreferences(
  userId: string,
  dailySummaryEnabled: boolean,
  preferredHour = 7,
): Promise<void> {
  await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: userId,
        daily_summary_enabled: dailySummaryEnabled,
        preferred_hour: preferredHour,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
}
