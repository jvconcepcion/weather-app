import { Text, View } from 'react-native';

export default function LicensesScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0B1220',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>Open Source Licenses</Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          textAlign: 'center',
          marginTop: 10,
          lineHeight: 22,
        }}
      >
        Open source license details will be added before release.
      </Text>
    </View>
  );
}
