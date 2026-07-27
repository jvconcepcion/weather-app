import { useEffect, useState } from 'react';
import {
  fetchNotificationPreferences,
  upsertNotificationPreferences,
} from '../lib/notificationPreferences';
import { useAuthStore } from '../store/useAuthStore';

export function useNotificationPreferences() {
  const user = useAuthStore((state) => state.user);
  const [dailySummaryEnabled, setDailySummaryEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setDailySummaryEnabled(false);
      return;
    }
    fetchNotificationPreferences(user.id).then((prefs) => {
      if (prefs) setDailySummaryEnabled(prefs.dailySummaryEnabled);
    });
  }, [user]);

  async function toggleDailySummary(enabled: boolean) {
    if (!user) return;
    setDailySummaryEnabled(enabled);
    setLoading(true);
    await upsertNotificationPreferences(user.id, enabled);
    setLoading(false);
  }

  return { dailySummaryEnabled, toggleDailySummary, loading };
}
