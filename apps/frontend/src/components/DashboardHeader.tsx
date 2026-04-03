'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    logout();
    router.push('/');
  };

  const isTasksActive = pathname === '/dashboard';
  const isProductivityActive = pathname === '/dashboard/productivity';

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side: Title and navigation */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>

            {/* Navigation menu */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isTasksActive
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Tarefas
              </Link>
              <Link
                href="/dashboard/productivity"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isProductivityActive
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Produtividade
              </Link>
            </nav>
          </div>

          {/* Right side: User info, theme toggle, logout */}
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        <nav className="sm:hidden flex gap-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Link
            href="/dashboard"
            className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium transition ${
              isTasksActive
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Tarefas
          </Link>
          <Link
            href="/dashboard/productivity"
            className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium transition ${
              isProductivityActive
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Produtividade
          </Link>
        </nav>
      </div>
    </header>
  );
}
