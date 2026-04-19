import { Account } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthState = {
    user: Account | null;
    isHydrated: boolean;
    setUser: (user: Account) => void;
    updateUser: (updates: Partial<Account>) => void;
    logOutUser: () => void;
    setHydrated: (hydrated: boolean) => void;
}

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      setUser: (user: Account) => set({ user }),
      updateUser: (updates: Partial<Account>) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
      logOutUser: () => set({ user: null }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: "auth-store",
    },
  ),
);

export default useAuthStore;
