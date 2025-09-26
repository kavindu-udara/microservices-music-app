import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        profileImage?: string;
        id: number
    } | null;
    loading: boolean;
    cartCount : number;
}

const initialState: AuthState = {
    user: null,
    cartCount: 0,
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        setCartCount(state, action){
            state.cartCount = action.payload;
        }
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;