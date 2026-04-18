import { Account } from "@/types";
import {create} from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    setUser: (user : Account) => set({ user }),
    updateUser: (updates : Partial<Account>) => set((state) => ({ user : { ...state.user, ...updates } })),
    logOutUser : () => set({ user : null }),
}));

export default useAuthStore;
