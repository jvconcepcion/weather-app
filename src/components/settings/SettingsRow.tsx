import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  danger?: boolean;
};

export function SettingsRow({ title, subtitle, right, danger = false }: Props) {
  return (
    <View className="min-h-[84px] flex-row items-center justify-between gap-3 px-4 py-4">
      <View className="flex-1 pr-2">
        <Text
          className={`mb-1 text-base font-semibold ${danger ? 'text-red-400' : 'text-slate-50'}`}
        >
          {title}
        </Text>

        {subtitle ? <Text className="text-sm leading-5 text-slate-400">{subtitle}</Text> : null}
      </View>

      {right}
    </View>
  );
}
