'use client';

import { formatTime } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  imageUrl?: string;
}

interface MessageBubbleProps {
  message: Message;
  onCopy?: () => void;
  isCopied?: boolean;
}

export default function MessageBubble({ message, onCopy, isCopied }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] lg:max-w-[70%] group relative`}>
        {/* Message Content */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600'
          }`}
        >
          {/* Image */}
          {message.imageUrl && (
            <div className="mb-3">
              <Image
                src={message.imageUrl}
                alt="Uploaded image"
                width={400}
                height={300}
                className="max-w-full max-h-64 rounded-xl object-cover shadow-sm"
              />
            </div>
          )}

          {/* Text Content */}
          {message.content && (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>

        {/* Copy Button (for AI messages) */}
        {!isUser && message.content && (
          <button
            onClick={onCopy}
            className={`absolute -top-2 -right-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 ${
              isCopied ? 'text-green-600' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
            }`}
            title={isCopied ? 'Copied!' : 'Copy message'}
          >
            {isCopied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
} 