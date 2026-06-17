import { View, type ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export function GlassCard({ children, className, style, ...props }: GlassCardProps) {
  return (
    <View
      className={`rounded-2xl border border-white/20 bg-white/10 p-4 ${className ?? ''}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
