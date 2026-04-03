'use client';

import { useState, FormEvent } from 'react';
import { useSubtasks } from '@/hooks/useSubtasks';

interface SubtaskInputProps {
  taskId: string;
  onSubtaskAdded?: () => void;
}

export function SubtaskInput({ taskId, onSubtaskAdded }: SubtaskInputProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addSubtask } = useSubtasks();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await addSubtask(taskId, title);
      setTitle('');
      onSubtaskAdded?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Adicionar subtarefa..."
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!title.trim() || isLoading}
        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '...' : '+'}
      </button>
    </form>
  );
}
