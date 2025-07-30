import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatroomReducer from './slices/chatroomSlice';
import messageReducer from './slices/messageSlice';
import uiReducer from './slices/uiSlice';

// Clear localStorage to start fresh (uncomment this line to reset state)
// if (typeof window !== 'undefined') {
//   localStorage.removeItem('gemini-clone-state');
// }

// Save state to localStorage safely
const saveState = (state: ReturnType<typeof store.getState>) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gemini-clone-state', serializedState);
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatrooms: chatroomReducer,
    messages: messageReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 