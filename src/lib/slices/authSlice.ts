import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  phone: string;
  countryCode: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  otpSent: false,
  otpVerified: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      state.otpSent = action.payload;
    },
    setOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.otpVerified = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.otpVerified = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
    },
  },
});

export const { setLoading, setOtpSent, setOtpVerified, setError, login, logout } = authSlice.actions;
export default authSlice.reducer; 