import { showConfirmAlert } from '@/utils/alets';
import { triggerLightImpact } from '@/utils/haptics';
import React, { useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';
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

  const [dailySummary, setDailySummary] = useState(false);

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
          </SettingsCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
