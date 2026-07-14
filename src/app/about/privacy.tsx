import { ScreenContainer } from '../../components/ScreenContainer';
import { Text, View } from 'react-native';

export default function PrivacyScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-2xl font-semibold text-white">Privacy Policy</Text>
        <Text className="mt-2.5 text-center text-sm leading-relaxed text-white/70">
          This is a placeholder Privacy Policy page for now.
        </Text>
      </View>
    </ScreenContainer>
  );
}
