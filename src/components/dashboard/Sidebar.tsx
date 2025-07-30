'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { updateChatroomTitle } from '@/lib/slices/chatroomSlice';
import { toast } from 'react-hot-toast';
import { formatTime } from '@/lib/utils';
import { Search, Plus, Trash2, Edit2, Check, X, MessageSquare, Settings } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { Chatroom } from '@/lib/slices/chatroomSlice';

interface User {
  id: string;
  phone: string;
  countryCode: string;
  name: string;
}

interface SidebarProps {
  user: User | null;
  chatrooms: Chatroom[];
  currentChatroom: Chatroom | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateChatroom: () => void;
  onDeleteChatroom: (id: string) => void;
  onSelectChatroom: (chatroom: Chatroom) => void;
  isCreatingChatroom: boolean;
}

export default function Sidebar({
  user,
  chatrooms = [],
  currentChatroom,
  searchQuery = '',
  onSearchChange,
  onCreateChatroom,
  onDeleteChatroom,
  onSelectChatroom,
  isCreatingChatroom,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const debouncedSearch = debounce(onSearchChange, 300);

  const handleEditStart = (chatroom: Chatroom) => {
    setEditingId(chatroom.id);
    setEditingTitle(chatroom.title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleEditSave = async () => {
    if (!editingId || !editingTitle.trim()) return;

    try {
      dispatch(updateChatroomTitle({ id: editingId, title: editingTitle.trim() }));
      setEditingId(null);
      setEditingTitle('');
      toast.success('Chat title updated');
    } catch {
      toast.error('Failed to update title');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.phone || 'No phone'}
            </p>
          </div>
          <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              debouncedSearch(value);
            }}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 dark:placeholder-slate-400"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onCreateChatroom}
          disabled={isCreatingChatroom}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chatrooms List */}
      <div className="flex-1 overflow-y-auto">
        {chatrooms.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No chats yet. Start a new conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  currentChatroom?.id === chatroom.id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 shadow-md'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
                onClick={() => onSelectChatroom(chatroom)}
              >
                {editingId === chatroom.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={handleEditSave}
                      className="p-1.5 text-green-600 hover:text-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="p-1.5 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {chatroom.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {formatTime(chatroom.updatedAt)}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(chatroom);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChatroom(chatroom.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 