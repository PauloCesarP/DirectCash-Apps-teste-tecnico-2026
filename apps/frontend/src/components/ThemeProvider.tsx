'use client';

import { useEffect, ReactNode } from 'react';
import { useThemeStore } from '@/lib/themeStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  return <>{children}</>;
}
