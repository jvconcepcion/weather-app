import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import type { AuthMode } from '../hooks/useLoginForm';

interface Props {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
}

export function AuthModeTabs({ mode, onSwitch }: Props) {
  const { t } = useTranslation();
  return (
    <View className="mb-6 flex-row rounded-2xl border border-white/10 bg-white/[0.05] p-1">
      {(['signin', 'signup'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onSwitch(tab)}
          activeOpacity={0.8}
          className={`flex-1 items-center rounded-xl py-2.5 ${mode === tab ? 'bg-violet-600' : ''}`}
        >
          <Text
            className={`text-[14px] font-semibold ${mode === tab ? 'text-white' : 'text-white/50'}`}
          >
            {tab === 'signin' ? t('auth.signIn') : t('auth.signUp')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
