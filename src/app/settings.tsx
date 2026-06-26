import { showConfirmAlert } from '@/utils/alets';
import { triggerLightImpact } from '@/utils/haptics';
import React, { useState } from 'react';
import { ScrollView, Share, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '../components/PageHeader';
import { SettingsActionRow } from '../components/settings/SettingsActionRow';
import { SettingsCard } from '../components/settings/SettingsCard';
import { SettingsRow } from '../components/settings/SettingsRow';
import { SettingsSectionLabel } from '../components/settings/SettingsSectionLabel';
import { UnitToggle } from '../components/settings/UnitToggle';
import { useAppStore } from '../store/useAppStore';

export default function SettingsScreen() {
  const unit = useAppStore((state) => state.unit);
  const setUnit = useAppStore((state) => state.setUnit);
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled);
  const setHapticsEnabled = useAppStore((state) => state.setHapticsEnabled);
  const clearFavorites = useAppStore((state) => state.clearFavorites);
  const clearRecentSearches = useAppStore((state) => state.clearRecentSearches);
  const clearWeatherCache = useAppStore((state) => state.clearWeatherCache);
  const pushToken = useAppStore((state) => state.pushToken);
  const pushTokenError = useAppStore((state) => state.pushTokenError);

  const [dailySummary, setDailySummary] = useState(false);

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
      title: 'Clear favorites?',
      message: 'This will remove all saved favorite cities.',
      onConfirm: async () => {
        await triggerLightImpact();
        clearFavorites();
      },
    });
  };

  const handleClearRecentSearches = () => {
    showConfirmAlert({
      title: 'Clear recent searches?',
      message: 'This will remove your saved city search history.',
      onConfirm: async () => {
        await triggerLightImpact();
        clearRecentSearches();
      },
    });
  };

  const handleClearWeatherCache = () => {
    showConfirmAlert({
      title: 'Clear weather cache?',
      message: 'This will reset stored forecast and weather data.',
      onConfirm: async () => {
        await triggerLightImpact();
        clearWeatherCache();
      },
    });
  };

  return (
    <View className="flex-1 bg-[#0B1220]">
      <SafeAreaView className="flex-1">
        <View className="px-5 pt-3">
          <PageHeader title="Settings" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
        >
          <SettingsSectionLabel title="Preferences" />
          <SettingsCard>
            <SettingsRow
              title="Temperature unit"
              subtitle="Choose how temperature is displayed"
              right={<UnitToggle unit={unit} onChange={handleSetUnit} />}
            />

            <View className="ml-4 h-px bg-slate-800" />

            <SettingsRow
              title="Haptics"
              subtitle="Enable vibration and touch feedback"
              right={
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  trackColor={{ false: '#334155', true: '#7c3aed' }}
                  thumbColor="#cbd5e1"
                />
              }
            />
          </SettingsCard>

          <SettingsSectionLabel title="Data" />
          <SettingsCard>
            <SettingsActionRow
              title="Clear favorites"
              subtitle="Remove all saved favorite cities"
              danger
              onPress={handleClearFavorites}
            />
            <SettingsActionRow
              title="Clear recent searches"
              subtitle="Remove saved city search history"
              danger
              onPress={handleClearRecentSearches}
            />
            <View className="ml-4 h-px bg-slate-800" />
            <SettingsActionRow
              title="Clear weather cache"
              subtitle="Reset stored forecast and weather data"
              danger
              onPress={handleClearWeatherCache}
            />
          </SettingsCard>

          <SettingsSectionLabel title="Notifications" />
          <SettingsCard className="mb-0">
            <SettingsRow
              title="Daily weather summary"
              subtitle="Coming soon..."
              right={
                <View className="opacity-60">
                  <Switch
                    value={dailySummary}
                    onValueChange={setDailySummary}
                    disabled
                    trackColor={{ false: '#334155', true: '#7c3aed' }}
                    thumbColor="#cbd5e1"
                  />
                </View>
              }
            />

            <View className="ml-4 h-px bg-slate-800" />

            <View style={{ padding: 16, gap: 8 }}>
              <Text
                style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}
              >
                EXPO PUSH TOKEN
              </Text>
              <Text style={{ color: '#64748b', fontSize: 12 }}>
                Use this token at expo.dev/notifications to send a test push notification.
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
                      Share token
                    </Text>
                  </TouchableOpacity>
                </>
              ) : pushTokenError ? (
                <Text style={{ color: '#f87171', fontSize: 12 }}>{pushTokenError}</Text>
              ) : (
                <Text style={{ color: '#475569', fontSize: 12 }}>
                  Registering for push notifications...
                </Text>
              )}
            </View>
          </SettingsCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
