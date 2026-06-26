import { Pressable, Text, View } from 'react-native';

type Unit = 'celsius' | 'fahrenheit';

type Props = {
  unit: Unit;
  onChange: (unit: Unit) => void;
};

export function UnitToggle({ unit, onChange }: Props) {
  return (
    <View className="flex-row rounded-xl border border-slate-800 bg-slate-950 p-1">
      <Pressable
        onPress={() => onChange('celsius')}
        className={`min-w-[48px] items-center justify-center rounded-lg px-3 py-2 ${
          unit === 'celsius' ? 'bg-violet-600' : ''
        }`}
      >
        <Text
          className={`text-sm font-bold ${unit === 'celsius' ? 'text-white' : 'text-slate-400'}`}
        >
          °C
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChange('fahrenheit')}
        className={`min-w-[48px] items-center justify-center rounded-lg px-3 py-2 ${
          unit === 'fahrenheit' ? 'bg-violet-600' : ''
        }`}
      >
        <Text
          className={`text-sm font-bold ${unit === 'fahrenheit' ? 'text-white' : 'text-slate-400'}`}
        >
          °F
        </Text>
      </Pressable>
    </View>
  );
}
