import { PageHeader } from '@/components/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0B1220',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom + 10, 28),
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <PageHeader title="About" />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons name="weather-partly-cloudy" size={64} color="#7DD3FC" />

          <Text
            style={{
              marginTop: 20,
              color: 'white',
              fontSize: 24,
              fontWeight: '600',
            }}
          >
            Weather App
          </Text>

          <Text
            style={{
              marginTop: 6,
              color: 'rgba(255,255,255,0.65)',
              fontSize: 12,
            }}
          >
            Version 1.0.0
          </Text>

          <Text
            style={{
              marginTop: 28,
              color: 'rgba(255,255,255,0.72)',
              fontSize: 12,
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            Copyright © 2026 Jonathan Concepcion.{'\n'}All rights reserved.
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={() => router.push('/about/terms')}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: 11,
                  textDecorationLine: 'underline',
                }}
              >
                Terms of Service
              </Text>
            </Pressable>

            <Text
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: 11,
                marginHorizontal: 4,
              }}
            >
              |
            </Text>

            <Pressable onPress={() => router.push('/about/privacy')}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: 11,
                  textDecorationLine: 'underline',
                }}
              >
                Privacy Policy
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.push('/about/licenses')}>
            <Text
              style={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: 11,
                textDecorationLine: 'underline',
              }}
            >
              Open Source Software Notice
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
