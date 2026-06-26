import { Pressable, Text } from 'react-native';
import { SettingsRow } from './SettingsRow';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
};

export function SettingsActionRow({ title, subtitle, onPress, danger = false }: Props) {
  return (
    <Pressable onPress={onPress}>
      <SettingsRow
        title={title}
        subtitle={subtitle}
        danger={danger}
        right={<Text className="ml-2 text-2xl text-slate-500">›</Text>}
      />
    </Pressable>
  );
}
