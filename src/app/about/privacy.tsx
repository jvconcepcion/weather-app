import { Text, View } from 'react-native';

export default function PrivacyScreen() {
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
      <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>Privacy Policy</Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          textAlign: 'center',
          marginTop: 10,
          lineHeight: 22,
        }}
      >
        This is a placeholder Privacy Policy page for now.
      </Text>
    </View>
  );
}
