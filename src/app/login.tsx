import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '../components/PageHeader';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 12,
          }}
        >
          <PageHeader title="Login" />
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>Login</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
