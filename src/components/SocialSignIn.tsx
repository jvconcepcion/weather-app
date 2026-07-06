import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  googleLoading: boolean;
  disabled: boolean;
  onGoogleSignIn: () => void;
  onGuestSignIn: () => void;
}

export function SocialSignIn({ googleLoading, disabled, onGoogleSignIn, onGuestSignIn }: Props) {
  return (
    <>
      <View className="my-6 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-white/10" />
        <Text className="text-xs text-white/30">or</Text>
        <View className="h-px flex-1 bg-white/10" />
      </View>

      <TouchableOpacity
        onPress={onGoogleSignIn}
        disabled={disabled}
        activeOpacity={0.85}
        className="flex-row items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] py-[15px]"
      >
        {googleLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
            <Text className="text-[15px] font-medium text-white">Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onGuestSignIn} className="mt-5 items-center">
        <Text className="text-sm text-slate-500">Continue as guest</Text>
      </TouchableOpacity>
    </>
  );
}
