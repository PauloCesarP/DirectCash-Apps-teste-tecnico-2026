'use client';

import { useTaskStore } from '@/lib/store';
import TaskCard from './TaskCard';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function TaskList() {
  const { tasks } = useTaskStore();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Nenhuma tarefa encontrada
        </p>
        <p className="text-gray-400 dark:text-gray-500">
          Crie uma nova tarefa para começar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task: Task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
