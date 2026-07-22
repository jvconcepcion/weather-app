import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface AuthInputProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences';
}

export function AuthInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: AuthInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4"
      style={{ height: 52 }}
    >
      <MaterialCommunityIcons name={icon} size={20} color="rgba(255,255,255,0.4)" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        secureTextEntry={secureTextEntry && !visible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'none'}
        autoCorrect={false}
        className="flex-1 text-[15px] text-white"
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setVisible((v) => !v)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          <MaterialCommunityIcons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="rgba(255,255,255,0.4)"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
