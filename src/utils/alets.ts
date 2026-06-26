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
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = true,
  onConfirm,
}: ConfirmAlertOptions) {
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    {
      text: confirmText,
      style: destructive ? 'destructive' : 'default',
      onPress: async () => {
        void onConfirm();
      },
    },
  ]);
}
