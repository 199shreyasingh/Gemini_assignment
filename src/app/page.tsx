'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import LoginPage from '@/components/auth/LoginPage';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state) => (state.ui as { isDarkMode: boolean })?.isDarkMode ?? false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="relative">
      {/* Dark mode test indicator - visible only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
        </div>
      )}
      <LoginPage />
    </div>
  );
}
