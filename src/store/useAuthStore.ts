import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  session: Session | null;
  initialized: boolean;
  isGuest: boolean;
  setSession: (session: Session | null) => void;
  setInitialized: (initialized: boolean) => void;
  setGuest: (isGuest: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  initialized: false,
  isGuest: false,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setInitialized: (initialized) => set({ initialized }),
  setGuest: (isGuest) => set({ isGuest }),
}));
