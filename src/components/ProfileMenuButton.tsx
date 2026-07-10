import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { signOut } from '../lib/googleSignIn';
import { useAuthStore } from '../store/useAuthStore';

interface ProfileMenuButtonProps {
  onLoginPress?: () => void;
  onSettingsPress?: () => void;
  onAboutPress?: () => void;
}

interface MenuItemProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, danger }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center gap-3 rounded-xl px-3 py-3"
    >
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={danger ? '#f87171' : 'rgba(255, 255, 255, 0.82)'}
      />
      <Text className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface SignOutConfirmModalProps {
  visible: boolean;
  signingOut: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function SignOutConfirmModal({
  visible,
  signingOut,
  onConfirm,
  onCancel,
}: SignOutConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable onPress={onCancel} className="flex-1 items-center justify-center bg-black/60">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="mx-8 w-full max-w-xs rounded-3xl border border-white/10 bg-[#151B28] p-6"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.4,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 8 },
            elevation: 16,
          }}
        >
          <View className="mb-1 items-center">
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <MaterialCommunityIcons name="logout" size={24} color="#f87171" />
            </View>
            <Text className="mb-1 text-center text-[17px] font-bold text-white">
              Are you sure to sign out?
            </Text>
          </View>

          <View className="mt-4 gap-2.5">
            <TouchableOpacity
              onPress={onConfirm}
              disabled={signingOut}
              activeOpacity={0.8}
              className="items-center justify-center rounded-2xl bg-red-500/90 py-3.5"
            >
              {signingOut ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-[15px] font-semibold text-white">Sign out</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              disabled={signingOut}
              activeOpacity={0.7}
              className="items-center py-3"
            >
              <Text className="text-[15px] text-slate-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ProfileMenuButton({
  onLoginPress,
  onSettingsPress,
  onAboutPress,
}: ProfileMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const buttonRef = useRef<View>(null);
  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const setGuest = useAuthStore((state) => state.setGuest);

  const fullName: string = user?.user_metadata?.full_name ?? '';
  const email: string = user?.email ?? '';
  const initial = fullName.charAt(0).toUpperCase() || email.charAt(0).toUpperCase();
  const avatarUrl: string | null =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;

  function closeMenu() {
    setIsOpen(false);
  }

  function handlePress(action?: () => void) {
    closeMenu();
    action?.();
  }

  function handleSignOutPress() {
    closeMenu();
    setShowSignOutConfirm(true);
  }

  async function handleSignOutConfirm() {
    setSigningOut(true);
    await signOut();
    setGuest(false);
    setSigningOut(false);
    setShowSignOutConfirm(false);
  }

  function openMenu() {
    buttonRef.current?.measure(
      (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
        const screenWidth = Dimensions.get('window').width;
        setMenuPos({ top: pageY + height + 6, right: screenWidth - pageX - width });
        setIsOpen(true);
      },
    );
  }

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={openMenu}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Open profile menu"
        className={`h-11 w-11 items-center justify-center rounded-full border ${user ? 'border-violet-600/60 bg-violet-600' : 'border-white/[0.18] bg-white/[0.14]'}`}
      >
        {user ? (
          avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="h-11 w-11 rounded-full" />
          ) : (
            <Text className="text-[15px] font-bold text-white">{initial}</Text>
          )
        ) : (
          <MaterialCommunityIcons name="account-outline" size={20} color="white" />
        )}
      </TouchableOpacity>

      {/* Profile dropdown menu */}
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable onPress={closeMenu} className="flex-1">
          <View
            pointerEvents="box-none"
            style={{ position: 'absolute', top: menuPos.top, right: menuPos.right }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="w-[200px] gap-1 rounded-2xl p-2"
              style={{
                backgroundColor: 'rgba(21, 27, 40, 0.98)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.10)',
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: 10,
              }}
            >
              {user ? (
                <>
                  <View className="mb-1 border-b border-white/[0.08] px-3 pb-2.5 pt-2">
                    <Text className="text-sm font-semibold text-white" numberOfLines={1}>
                      {fullName || 'User'}
                    </Text>
                    <Text className="mt-0.5 text-xs text-slate-500" numberOfLines={1}>
                      {email}
                    </Text>
                  </View>
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
                  <View className="my-1 h-px bg-white/[0.08]" />
                  <MenuItem icon="logout" label="Sign out" onPress={handleSignOutPress} danger />
                </>
              ) : isGuest ? (
                <>
                  <View className="mb-1 border-b border-white/[0.08] px-3 pb-2.5 pt-2">
                    <Text className="text-[13px] text-slate-400">Browsing as guest</Text>
                  </View>
                  <MenuItem
                    icon="login"
                    label="Sign in"
                    onPress={() => {
                      closeMenu();
                      setGuest(false);
                      onLoginPress?.();
                    }}
                  />
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
                </>
              ) : (
                <>
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
                </>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <SignOutConfirmModal
        visible={showSignOutConfirm}
        signingOut={signingOut}
        onConfirm={handleSignOutConfirm}
        onCancel={() => setShowSignOutConfirm(false)}
      />
    </>
  );
}
