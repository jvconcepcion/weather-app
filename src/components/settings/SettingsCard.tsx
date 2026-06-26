import { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  children: ReactNode;
  className?: string;
};

export function SettingsCard({ children, className = '' }: Props) {
  return (
    <View
      className={`mb-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 ${className}`}
    >
      {children}
    </View>
  );
}
