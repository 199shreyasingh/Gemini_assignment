'use client';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] lg:max-w-[70%]">
        <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Gemini is typing...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 