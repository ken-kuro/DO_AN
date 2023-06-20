import { User } from '@reactive-resume/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  currentUser: any;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
  currentUser: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isLoggedIn = true;
    },
    logout: () => initialState,
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setUser, setAccessToken, logout, setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
