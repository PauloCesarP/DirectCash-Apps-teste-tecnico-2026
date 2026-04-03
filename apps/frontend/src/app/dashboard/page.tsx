'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useTaskStore } from '@/lib/store';
import { tasksAPI } from '@/lib/api';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { tasks, setTasks } = useTaskStore();
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Espera o estado de autenticação ser carregado do localStorage
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Carrega as tarefas apenas se autenticado
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await tasksAPI.getAll({ status: filter || undefined });
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      loadTasks();
    }
  }, [isAuthenticated, authLoading, filter, setTasks]);

  // Mostra carregando enquanto restaura o estado de autenticação
  if (authLoading || !isAuthenticated || isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <DashboardHeader title="Tarefas" />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskForm />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tarefas ({tasks.length})
                </h2>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="TODO">Por fazer</option>
                    <option value="IN_PROGRESS">Em progresso</option>
                    <option value="DONE">Completadas</option>
                  </select>
                </div>
              </div>

              <TaskList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
