import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

interface ChatroomState {
  chatrooms: Chatroom[];
  currentChatroom: Chatroom | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatroomState = {
  chatrooms: [],
  currentChatroom: null,
  isLoading: false,
  error: null,
};

const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setChatrooms: (state, action: PayloadAction<Chatroom[]>) => {
      state.chatrooms = action.payload;
    },
    addChatroom: (state, action: PayloadAction<Chatroom>) => {
      state.chatrooms.unshift(action.payload);
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      state.chatrooms = state.chatrooms.filter(room => room.id !== action.payload);
      if (state.currentChatroom?.id === action.payload) {
        state.currentChatroom = null;
      }
    },
    setCurrentChatroom: (state, action: PayloadAction<Chatroom | null>) => {
      state.currentChatroom = action.payload;
    },
    updateChatroomTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const chatroom = state.chatrooms.find(room => room.id === action.payload.id);
      if (chatroom) {
        chatroom.title = action.payload.title;
        chatroom.updatedAt = new Date().toISOString();
      }
      if (state.currentChatroom?.id === action.payload.id) {
        state.currentChatroom.title = action.payload.title;
        state.currentChatroom.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setChatrooms,
  addChatroom,
  deleteChatroom,
  setCurrentChatroom,
  updateChatroomTitle,
} = chatroomSlice.actions;

export default chatroomSlice.reducer; 