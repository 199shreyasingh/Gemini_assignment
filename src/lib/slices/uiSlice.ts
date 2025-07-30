import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isDarkMode: boolean;
  sidebarOpen: boolean;
  searchQuery: string;
}

const initialState: UIState = {
  isDarkMode: false, // Always start with false to prevent hydration mismatch
  sidebarOpen: true,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer; 