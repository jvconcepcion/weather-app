import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onBack: () => void;
}

export function ForgotHeader({ onBack }: Props) {
  return (
    <View className="mb-6">
      <TouchableOpacity onPress={onBack} className="mb-4 flex-row items-center gap-1.5">
        <MaterialCommunityIcons name="arrow-left" size={18} color="rgba(255,255,255,0.6)" />
        <Text className="text-sm text-white/60">Back to sign in</Text>
      </TouchableOpacity>
      <Text className="text-xl font-bold text-white">Reset password</Text>
      <Text className="mt-1 text-sm text-slate-400">
        Use your account email to reset your password.
      </Text>
    </View>
  );
}
