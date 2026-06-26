import * as Haptics from 'expo-haptics';
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
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled);
  const setUnit = useAppStore((state) => state.setUnit);
  const setHapticsEnabled = useAppStore((state) => state.setHapticsEnabled);

  const [dailySummary, setDailySummary] = useState(false);

  const handleSetUnit = async (nextUnit: 'celsius' | 'fahrenheit') => {
    if (unit === nextUnit) return;
    if (hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setUnit(nextUnit);
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
              title="Clear recent searches"
              subtitle="Remove saved city search history"
              danger
            />
            <View className="ml-4 h-px bg-slate-800" />
            <SettingsActionRow
              title="Clear weather cache"
              subtitle="Reset stored forecast and weather data"
              danger
            />
          </SettingsCard>

          <SettingsSectionLabel title="Notifications" />
          <SettingsCard className="mb-0">
            <SettingsRow
              title="Daily weather summary"
              subtitle="Coming soon in a later phase"
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
