'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const loadFromLocalStorage = useAuthStore((state) => state.loadFromLocalStorage);

  useEffect(() => {
    // Restaurar autenticação do localStorage ao carregar a página
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return <>{children}</>;
}
