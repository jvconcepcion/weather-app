import { PageHeader } from '@/components/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';

export default function AboutScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenContainer>
      <View className="flex-1 px-5 pb-7 pt-3">
        <PageHeader title={t('about.title')} />
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
            {t('auth.appName')}
          </Text>

          <Text
            style={{
              marginTop: 6,
              color: 'rgba(255,255,255,0.65)',
              fontSize: 12,
            }}
          >
            {t('about.version', { version: '1.0.0' })}
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
            {t('about.copyright', { year: new Date().getFullYear() })}
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
                {t('about.termsOfService')}
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
                {t('about.privacyPolicy')}
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
              {t('about.ossNotice')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
