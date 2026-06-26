import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';

export async function triggerLightImpact() {
  const { hapticsEnabled } = useAppStore.getState();
  if (!hapticsEnabled) return;

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function triggerSelectionHaptic() {
  const { hapticsEnabled } = useAppStore.getState();
  if (!hapticsEnabled) return;

  await Haptics.selectionAsync();
}

export async function triggerSuccessHaptic() {
  const { hapticsEnabled } = useAppStore.getState();
  if (!hapticsEnabled) return;

  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
