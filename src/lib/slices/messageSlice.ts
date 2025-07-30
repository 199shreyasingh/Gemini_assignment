import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  imageUrl?: string;
}

interface MessageState {
  messagesByChatroom: { [chatroomId: string]: Message[] };
  typingByChatroom: { [chatroomId: string]: boolean };
  isLoading: boolean;
  error: string | null;
  currentPage: { [chatroomId: string]: number };
  hasMore: { [chatroomId: string]: boolean };
}

const initialState: MessageState = {
  messagesByChatroom: {},
  typingByChatroom: {},
  isLoading: false,
  error: null,
  currentPage: {},
  hasMore: {},
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTyping: (state, action: PayloadAction<{ chatroomId: string; isTyping: boolean }>) => {
      const { chatroomId, isTyping } = action.payload;
      state.typingByChatroom[chatroomId] = isTyping;
    },
    addMessage: (state, action: PayloadAction<{ chatroomId: string; message: Message }>) => {
      const { chatroomId, message } = action.payload;
      if (!state.messagesByChatroom[chatroomId]) {
        state.messagesByChatroom[chatroomId] = [];
      }
      state.messagesByChatroom[chatroomId].push(message);
    },
    addMessages: (state, action: PayloadAction<{ chatroomId: string; messages: Message[] }>) => {
      const { chatroomId, messages } = action.payload;
      if (!state.messagesByChatroom[chatroomId]) {
        state.messagesByChatroom[chatroomId] = [];
      }
      state.messagesByChatroom[chatroomId].unshift(...messages);
    },
    updateMessage: (state, action: PayloadAction<{ chatroomId: string; messageId: string; updates: Partial<Message> }>) => {
      const { chatroomId, messageId, updates } = action.payload;
      const messageIndex = state.messagesByChatroom[chatroomId]?.findIndex(msg => msg.id === messageId);
      if (messageIndex !== undefined && messageIndex !== -1) {
        state.messagesByChatroom[chatroomId][messageIndex] = { ...state.messagesByChatroom[chatroomId][messageIndex], ...updates };
      }
    },
    setCurrentPage: (state, action: PayloadAction<{ chatroomId: string; page: number }>) => {
      const { chatroomId, page } = action.payload;
      state.currentPage[chatroomId] = page;
    },
    setHasMore: (state, action: PayloadAction<{ chatroomId: string; hasMore: boolean }>) => {
      const { chatroomId, hasMore } = action.payload;
      state.hasMore[chatroomId] = hasMore;
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      const chatroomId = action.payload;
      state.messagesByChatroom[chatroomId] = [];
      state.typingByChatroom[chatroomId] = false;
      state.currentPage[chatroomId] = 1;
      state.hasMore[chatroomId] = true;
    },
  },
});

export const {
  setLoading,
  setError,
  setTyping,
  addMessage,
  addMessages,
  updateMessage,
  setCurrentPage,
  setHasMore,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer; 