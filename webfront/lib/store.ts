import {create} from "zustand";

type User = {
    firstName: string;
    lastName: string;
    email: string;
    verified: boolean;
    role : "USER" | "ADMIN";
};

const useAuthStore = create((set) => ({
    user: null,
    setUser: (user : User) => set({ user }),
    updateUser: (updates : Partial<User>) => set((state) => ({ user : { ...state.user, ...updates } })),
    logOutUser : () => set({ user : null }),
}));

export default useAuthStore;
