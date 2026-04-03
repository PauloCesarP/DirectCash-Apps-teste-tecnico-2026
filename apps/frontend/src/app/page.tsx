'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex flex-col items-center justify-center relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
          Task Manager
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Organize suas tarefas de forma simples e eficiente
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
          >
            Registrar
          </Link>
        </div>
      </div>
    </main>
  );
}
