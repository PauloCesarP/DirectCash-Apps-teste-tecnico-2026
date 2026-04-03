import '@/styles/globals.css';
import type { Metadata } from 'next';
import React from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NotificationCenter } from '@/components/NotificationCenter';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <NotificationCenter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
