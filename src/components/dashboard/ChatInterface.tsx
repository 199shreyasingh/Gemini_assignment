'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { addMessage, setTyping } from '@/lib/slices/messageSlice';
import { updateChatroomTitle } from '@/lib/slices/chatroomSlice';
import { simulateAIResponse } from '@/lib/api';
import { generateId } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Send, Image } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  chatroomId: string;
}

export default function ChatInterface({ chatroomId }: ChatInterfaceProps) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => 
    state.messages.messagesByChatroom[chatroomId] || []
  );
  const isTyping = useAppSelector((state) => 
    state.messages.typingByChatroom[chatroomId] || false
  );
  const currentChatroom = useAppSelector((state) => 
    state.chatrooms.currentChatroom
  );

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-update chatroom title based on first user message
  useEffect(() => {
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    if (firstUserMessage && currentChatroom && currentChatroom.title === 'New Chat') {
      const title = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
      dispatch(updateChatroomTitle({ id: chatroomId, title }));
    }
  }, [messages, currentChatroom, chatroomId, dispatch]);

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!content.trim() && !imageUrl) return;

    const userMessage = {
      id: generateId(),
      content: content.trim(),
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
      imageUrl,
    };

    dispatch(addMessage({ chatroomId, message: userMessage }));
    setInputValue('');
    setIsLoading(true);
    dispatch(setTyping({ chatroomId, isTyping: true }));

    try {
      // Simulate AI response with delay
      const aiResponse = await simulateAIResponse(content);
      
      setTimeout(() => {
        dispatch(setTyping({ chatroomId, isTyping: false }));
        
        const aiMessage = {
          id: generateId(),
          content: aiResponse,
          sender: 'ai' as const,
          timestamp: new Date().toISOString(),
        };

        dispatch(addMessage({ chatroomId, message: aiMessage }));
        setIsLoading(false);
      }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds
    } catch {
      console.error('Error getting AI response');
      dispatch(setTyping({ chatroomId, isTyping: false }));
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      handleSendMessage('', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast.success('Message copied to clipboard!');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      toast.error('Failed to copy message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Ask me anything! I can help with questions, creative tasks, and more.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={() => handleCopyMessage(message.id, message.content)}
                isCopied={copiedMessageId === message.id}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Gemini..."
              className="w-full min-h-[44px] max-h-32 px-4 py-3 pr-12 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                title="Upload image"
              >
                <Image className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={(!inputValue.trim() && !isLoading) || isLoading}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Help text */}
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
} 