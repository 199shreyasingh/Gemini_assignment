'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { setDarkMode } from '@/lib/slices/uiSlice';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize dark mode on client side after mounting
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      dispatch(setDarkMode(savedTheme === 'dark'));
    } else {
      dispatch(setDarkMode(systemPrefersDark));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme to document
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  // Prevent hydration mismatch by rendering the same content on server and client initially
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
} 