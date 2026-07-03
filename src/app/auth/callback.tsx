import { ActivityIndicator, View } from 'react-native';

// Landing view for weatherapp://auth/callback deep link
export default function AuthCallbackScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#0B1220]">
      <ActivityIndicator size="large" color="#7c3aed" />
    </View>
  );
}
