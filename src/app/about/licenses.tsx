import { ScreenContainer } from '../../components/ScreenContainer';
import { Text, View } from 'react-native';

export default function LicensesScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-2xl font-semibold text-white">Open Source Licenses</Text>
        <Text className="mt-2.5 text-center text-sm leading-relaxed text-white/70">
          Open source license details will be added before release.
        </Text>
      </View>
    </ScreenContainer>
  );
}
