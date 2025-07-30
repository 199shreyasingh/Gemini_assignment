'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { setSidebarOpen, toggleDarkMode, setSearchQuery } from '@/lib/slices/uiSlice';
import { addChatroom, deleteChatroom, setCurrentChatroom } from '@/lib/slices/chatroomSlice';
import { clearMessages } from '@/lib/slices/messageSlice';
import { logout } from '@/lib/slices/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { generateId } from '@/lib/utils';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import { Menu, Moon, Sun, LogOut, Plus } from 'lucide-react';

interface UIState {
  sidebarOpen: boolean;
  isDarkMode: boolean;
  searchQuery: string;
}

interface ChatroomState {
  chatrooms: Array<{
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
  }>;
  currentChatroom: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
  } | null;
}

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isCreatingChatroom, setIsCreatingChatroom] = useState(false);

  // Safe state access with defaults
  const user = useAppSelector((state) => state.auth?.user);
  const sidebarOpen = useAppSelector((state) => (state.ui as UIState)?.sidebarOpen ?? true);
  const isDarkMode = useAppSelector((state) => (state.ui as UIState)?.isDarkMode ?? false);
  const searchQuery = useAppSelector((state) => (state.ui as UIState)?.searchQuery ?? '');
  const chatrooms = useAppSelector((state) => (state.chatrooms as ChatroomState)?.chatrooms ?? []);
  const currentChatroom = useAppSelector((state) => (state.chatrooms as ChatroomState)?.currentChatroom ?? null);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    toast.success('Logged out successfully');
  };

  const handleCreateChatroom = () => {
    setIsCreatingChatroom(true);
    const newChatroom = {
      id: generateId(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };

    dispatch(addChatroom(newChatroom));
    dispatch(setCurrentChatroom(newChatroom));
    dispatch(clearMessages(newChatroom.id));
    setIsCreatingChatroom(false);
    toast.success('New chat created!');
  };

  const handleDeleteChatroom = (chatroomId: string) => {
    dispatch(deleteChatroom(chatroomId));
    if (currentChatroom?.id === chatroomId) {
      dispatch(setCurrentChatroom(null));
    }
    toast.success('Chat deleted successfully');
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
    toast.success(isDarkMode ? 'Switched to light mode' : 'Switched to dark mode');
  };

  const filteredChatrooms = chatrooms.filter((chatroom) =>
    chatroom.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex transition-colors duration-200">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          user={user}
          chatrooms={filteredChatrooms}
          currentChatroom={currentChatroom}
          searchQuery={searchQuery}
          onSearchChange={(query) => dispatch(setSearchQuery(query))}
          onCreateChatroom={handleCreateChatroom}
          onDeleteChatroom={handleDeleteChatroom}
          onSelectChatroom={(chatroom) => dispatch(setCurrentChatroom(chatroom))}
          isCreatingChatroom={isCreatingChatroom}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-4 lg:px-6 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white truncate transition-colors duration-200">
              {currentChatroom ? currentChatroom.title : 'Gemini Clone'}
            </h1>
            {/* Dark mode indicator */}
            <div className={`w-4 h-4 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
            {/* Dark mode test text */}
            <span className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-yellow-400' : 'text-blue-500'}`}>
              {isDarkMode ? 'DARK' : 'LIGHT'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleDarkMode}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          {currentChatroom ? (
            <ChatInterface chatroomId={currentChatroom.id} />
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">💬</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-200">
                  Welcome to Gemini Clone
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg transition-colors duration-200">
                  Start a new conversation or select an existing chat to begin your AI journey
                </p>
                <button
                  onClick={handleCreateChatroom}
                  disabled={isCreatingChatroom}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                >
                  {isCreatingChatroom ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  <span>{isCreatingChatroom ? 'Creating...' : 'Start New Chat'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 