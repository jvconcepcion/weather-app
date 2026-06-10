import { View, type ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export function GlassCard({ children, className, style, ...props }: GlassCardProps) {
  return (
    <View
      className={`bg-white/10 border border-white/20 rounded-2xl p-4 ${className ?? ''}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
