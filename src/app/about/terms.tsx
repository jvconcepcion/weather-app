import { ScreenContainer } from '../../components/ScreenContainer';
import { Text, View } from 'react-native';

export default function TermsScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-2xl font-semibold text-white">Terms of Service</Text>
        <Text className="mt-2.5 text-center text-sm leading-relaxed text-white/70">
          This is a placeholder Terms of Service page for now.
        </Text>
      </View>
    </ScreenContainer>
  );
}
