'use client';

import { useEffect } from 'react';
import { useSubtasks } from '@/hooks/useSubtasks';

interface SubtaskListProps {
  taskId: string;
}

export function SubtaskList({ taskId }: SubtaskListProps) {
  const { subtasks, isLoading, fetchSubtasks, toggleSubtask, deleteSubtask } =
    useSubtasks();

  useEffect(() => {
    fetchSubtasks(taskId);
  }, [taskId, fetchSubtasks]);

  if (isLoading) {
    return <div className="text-gray-500 dark:text-gray-400 text-sm">Carregando subtarefas...</div>;
  }

  if (subtasks.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400 text-sm italic">Nenhuma subtarefa</div>;
  }

  return (
    <div className="space-y-2">
      {subtasks.map((subtask) => (
        <div
          key={subtask.id}
          className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
        >
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={(e) => toggleSubtask(taskId, subtask.id, e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <span
            className={`flex-1 ${
              subtask.completed
                ? 'line-through text-gray-500 dark:text-gray-400'
                : 'text-gray-800 dark:text-gray-100'
            }`}
          >
            {subtask.title}
          </span>
          <button
            onClick={() => deleteSubtask(taskId, subtask.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs px-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
