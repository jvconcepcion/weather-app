import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface ProfileMenuButtonProps {
  onLoginPress?: () => void;
  onSettingsPress?: () => void;
  onAboutPress?: () => void;
}

interface MenuItemProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
      }}
    >
      <MaterialCommunityIcons name={icon} size={18} color="rgba(255, 255, 255, 0.82)" />
      <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function ProfileMenuButton({
  onLoginPress,
  onSettingsPress,
  onAboutPress,
}: ProfileMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  function handlePress(action?: () => void) {
    closeMenu();
    action?.();
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.85}
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.14)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.18)',
        }}
      >
        <MaterialCommunityIcons name="account-outline" size={20} color="white" />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable
          onPress={closeMenu}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              top: 54,
              right: 16,
            }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                width: 168,
                borderRadius: 16,
                padding: 8,
                backgroundColor: 'rgba(21, 27, 40, 0.98)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.10)',
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: 10,
                gap: 4,
              }}
            >
              <MenuItem icon="login" label="Log in" onPress={() => handlePress(onLoginPress)} />
              <MenuItem
                icon="cog-outline"
                label="Settings"
                onPress={() => handlePress(onSettingsPress)}
              />
              <MenuItem
                icon="information-outline"
                label="About"
                onPress={() => handlePress(onAboutPress)}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
