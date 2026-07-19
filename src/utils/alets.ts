import i18next from '../i18n';
import { Alert } from 'react-native';

type ConfirmAlertOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function showConfirmAlert({
  title,
  message,
  confirmText,
  cancelText,
  destructive = true,
  onConfirm,
}: ConfirmAlertOptions) {
  const resolvedConfirmText = confirmText ?? i18next.t('common.confirm');
  const resolvedCancelText = cancelText ?? i18next.t('common.cancel');
  Alert.alert(title, message, [
    { text: resolvedCancelText, style: 'cancel' },
    {
      text: resolvedConfirmText,
      style: destructive ? 'destructive' : 'default',
      onPress: async () => {
        void onConfirm();
      },
    },
  ]);
}
