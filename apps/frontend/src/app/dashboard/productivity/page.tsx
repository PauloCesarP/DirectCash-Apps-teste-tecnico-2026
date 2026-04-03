'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ProductivityDashboard } from '@/components/ProductivityDashboard';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function ProductivityPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <DashboardHeader title="Produtividade" />

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <ProductivityDashboard />
      </div>
    </main>
  );
}
