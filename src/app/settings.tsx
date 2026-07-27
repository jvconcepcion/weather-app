import { showConfirmAlert } from '@/utils/alets';
import { triggerLightImpact } from '@/utils/haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Share, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { ScreenContainer } from '../components/ScreenContainer';
import { SettingsActionRow } from '../components/settings/SettingsActionRow';
import { SettingsCard } from '../components/settings/SettingsCard';
import { SettingsRow } from '../components/settings/SettingsRow';
import { SettingsSectionLabel } from '../components/settings/SettingsSectionLabel';
import { UnitToggle } from '../components/settings/UnitToggle';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';

const LANGUAGE_OPTIONS: { value: string | null; native: string }[] = [
  { value: null, native: '' },
  { value: 'en', native: 'English' },
  { value: 'zh', native: '中文（简体）' },
  { value: 'ko', native: '한국어' },
  { value: 'ja', native: '日本語' },
];

function LanguagePicker() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  return (
    <View>
      {LANGUAGE_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value ?? 'auto'}
          onPress={() => setLanguage(option.value)}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text style={{ flex: 1, color: 'white', fontSize: 14 }}>
            {option.value === null ? t('settings.languageAuto') : option.native}
          </Text>
          {language === option.value && (
            <MaterialCommunityIcons name="check" size={18} color="#7c3aed" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const unit = useAppStore((state) => state.unit);
  const setUnit = useAppStore((state) => state.setUnit);
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled);
  const setHapticsEnabled = useAppStore((state) => state.setHapticsEnabled);
  const clearFavorites = useAppStore((state) => state.clearFavorites);
  const clearRecentSearches = useAppStore((state) => state.clearRecentSearches);
  const clearWeatherCache = useAppStore((state) => state.clearWeatherCache);
  const pushToken = useAppStore((state) => state.pushToken);
  const pushTokenError = useAppStore((state) => state.pushTokenError);

  const user = useAuthStore((state) => state.user);
  const { dailySummaryEnabled, toggleDailySummary, loading } = useNotificationPreferences();
  const { isTablet } = useBreakpoint();

  const handleShareToken = () => {
    if (!pushToken) return;
    Share.share({ message: pushToken });
  };

  const handleSetUnit = async (nextUnit: 'celsius' | 'fahrenheit') => {
    if (unit === nextUnit) return;
    await triggerLightImpact();
    setUnit(nextUnit);
  };

  const handleClearFavorites = () => {
    showConfirmAlert({
      title: t('settings.clearFavoritesTitle'),
      message: t('settings.clearFavoritesMsg'),
      onConfirm: async () => {
        await triggerLightImpact();
        clearFavorites();
      },
    });
  };

  const handleClearRecentSearches = () => {
    showConfirmAlert({
      title: t('settings.clearRecentSearchesTitle'),
      message: t('settings.clearRecentSearchesMsg'),
      onConfirm: async () => {
        await triggerLightImpact();
        clearRecentSearches();
      },
    });
  };

  const handleClearWeatherCache = () => {
    showConfirmAlert({
      title: t('settings.clearWeatherCacheTitle'),
      message: t('settings.clearWeatherCacheMsg'),
      onConfirm: async () => {
        await triggerLightImpact();
        clearWeatherCache();
      },
    });
  };

  return (
    <ScreenContainer>
      <View
        style={{
          paddingHorizontal: isTablet ? 40 : 20,
          paddingTop: 12,
          maxWidth: isTablet ? 768 : undefined,
          alignSelf: isTablet ? 'center' : undefined,
          width: '100%',
        }}
      >
        <PageHeader title={t('settings.title')} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 40 : 20,
          paddingTop: 20,
          paddingBottom: 32,
          maxWidth: isTablet ? 768 : undefined,
          alignSelf: isTablet ? 'center' : undefined,
          width: '100%',
        }}
      >
        <SettingsSectionLabel title={t('settings.preferences')} />
        <SettingsCard>
          <SettingsRow
            title={t('settings.temperatureUnit')}
            subtitle={t('settings.temperatureUnitSub')}
            right={<UnitToggle unit={unit} onChange={handleSetUnit} />}
          />

          <View className="ml-4 h-px bg-slate-800" />

          <SettingsRow
            title={t('settings.haptics')}
            subtitle={t('settings.hapticsSub')}
            right={
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
                thumbColor="#cbd5e1"
              />
            }
          />

          <View className="ml-4 h-px bg-slate-800" />

          <SettingsRow title={t('settings.language')} subtitle={t('settings.languageSub')} />
          <LanguagePicker />
        </SettingsCard>

        <SettingsSectionLabel title={t('settings.data')} />
        <SettingsCard>
          <SettingsActionRow
            title={t('settings.clearFavorites')}
            subtitle={t('settings.clearFavoritesSub')}
            danger
            onPress={handleClearFavorites}
          />
          <SettingsActionRow
            title={t('settings.clearRecentSearches')}
            subtitle={t('settings.clearRecentSearchesSub')}
            danger
            onPress={handleClearRecentSearches}
          />
          <View className="ml-4 h-px bg-slate-800" />
          <SettingsActionRow
            title={t('settings.clearWeatherCache')}
            subtitle={t('settings.clearWeatherCacheSub')}
            danger
            onPress={handleClearWeatherCache}
          />
        </SettingsCard>

        <SettingsSectionLabel title={t('settings.notifications')} />
        <SettingsCard className="mb-0">
          <SettingsRow
            title={t('settings.dailySummary')}
            subtitle={t('settings.dailySummarySub')}
            right={
              <View className={loading ? 'opacity-50' : undefined}>
                <Switch
                  value={dailySummaryEnabled}
                  onValueChange={toggleDailySummary}
                  disabled={!user || loading}
                  trackColor={{ false: '#334155', true: '#7c3aed' }}
                  thumbColor="#cbd5e1"
                />
              </View>
            }
          />

          <View className="ml-4 h-px bg-slate-800" />

          <View style={{ padding: 16, gap: 8 }}>
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
              {t('settings.expoPushToken')}
            </Text>
            <Text style={{ color: '#64748b', fontSize: 12 }}>
              {t('settings.expoPushTokenDesc')}
            </Text>

            {pushToken ? (
              <>
                <TextInput
                  value={pushToken}
                  editable={false}
                  selectTextOnFocus
                  multiline
                  style={{
                    color: '#e2e8f0',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    padding: 12,
                  }}
                />
                <TouchableOpacity
                  onPress={handleShareToken}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(124, 58, 237, 0.4)',
                    borderRadius: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                  }}
                >
                  <Text style={{ color: '#a78bfa', fontSize: 13, fontWeight: '600' }}>
                    {t('settings.shareToken')}
                  </Text>
                </TouchableOpacity>
              </>
            ) : pushTokenError ? (
              <Text style={{ color: '#f87171', fontSize: 12 }}>{pushTokenError}</Text>
            ) : (
              <Text style={{ color: '#475569', fontSize: 12 }}>
                {t('settings.registeringPush')}
              </Text>
            )}
          </View>
        </SettingsCard>
      </ScrollView>
    </ScreenContainer>
  );
}
