import { Text } from 'react-native';

type Props = {
  title: string;
};

export function SettingsSectionLabel({ title }: Props) {
  return (
    <Text className="mb-3 mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
      {title}
    </Text>
  );
}
