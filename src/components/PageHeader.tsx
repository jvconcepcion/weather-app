import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => router.replace('/')}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
      </TouchableOpacity>

      <Text className="ml-4 text-lg font-semibold text-white">{title}</Text>
    </View>
  );
}
