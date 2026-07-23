import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { upsertPushToken } from '../lib/pushTokens';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

async function registerForPushNotificationsAsync(): Promise<{
  token: string | null;
  error: string | null;
}> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { token: null, error: 'Permission denied. Enable notifications in device settings.' };
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return { token: data, error: null };
  } catch (err) {
    return { token: null, error: String(err) };
  }
}

export function usePushNotifications() {
  const setPushToken = useAppStore((state) => state.setPushToken);
  const setPushTokenError = useAppStore((state) => state.setPushTokenError);
  const pushToken = useAppStore((state) => state.pushToken);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    registerForPushNotificationsAsync().then(({ token, error }) => {
      setPushToken(token);
      setPushTokenError(error);
    });

    const notifSub = Notifications.addNotificationReceivedListener(() => {
      // foreground notification received
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener(() => {
      // user tapped the notification
    });

    return () => {
      notifSub.remove();
      responseSub.remove();
    };
  }, [setPushToken, setPushTokenError]);

  useEffect(() => {
    if (!user || !pushToken) return;
    upsertPushToken(user.id, pushToken);
  }, [user, pushToken]);
}
