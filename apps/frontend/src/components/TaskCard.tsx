'use client';

import { useState } from 'react';
import { tasksAPI } from '@/lib/api';
import { useTaskStore } from '@/lib/store';
import { SubtaskList } from './SubtaskList';
import { SubtaskInput } from './SubtaskInput';

interface TaskCardProps {
  task: any;
}

const statusLabels: Record<string, string> = {
  TODO: 'Por Fazer',
  IN_PROGRESS: 'Em Progresso',
  DONE: 'Completo',
};

const statusColors: Record<string, string> = {
  TODO: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  DONE: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
};

const priorityLabels: Record<string, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
};

const priorityColors: Record<string, string> = {
  LOW: 'text-gray-500',
  MEDIUM: 'text-amber-500',
  HIGH: 'text-red-500',
};

export default function TaskCard({ task }: TaskCardProps) {
  const { deleteTask, updateTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [subtasksRefresh, setSubtasksRefresh] = useState(0);

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar essa tarefa?')) {
      setIsLoading(true);
      try {
        await tasksAPI.delete(task.id);
        deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const response = await tasksAPI.update(task.id, {
        status: newStatus,
      });
      updateTask(task.id, response.data);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                statusColors[task.status]
              }`}
            >
              {statusLabels[task.status]}
            </span>
            <span
              className={`text-sm font-medium ${priorityColors[task.priority]}`}
            >
              Prioridade: {priorityLabels[task.priority]}
            </span>
          </div>
          {task.dueDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isLoading}
            className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
          >
            <option value="TODO">Por Fazer</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="DONE">Completo</option>
          </select>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-3 py-1 bg-red-600 dark:bg-red-700 text-white text-sm rounded hover:bg-red-700 dark:hover:bg-red-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition"
          >
            Deletar
          </button>
        </div>
      </div>

      {/* Subtasks Section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Subtarefas
        </p>
        <SubtaskInput 
          taskId={task.id} 
          onSubtaskAdded={() => setSubtasksRefresh(prev => prev + 1)}
        />
        <div className="mt-3">
          <SubtaskList key={subtasksRefresh} taskId={task.id} />
        </div>
      </div>
    </div>
  );
}
