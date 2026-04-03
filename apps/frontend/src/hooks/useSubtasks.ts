'use client';

import { useState, useCallback } from 'react';
import { subtasksAPI } from '@/lib/api';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  taskId: string;
}

interface UseSubtasksReturn {
  subtasks: Subtask[];
  isLoading: boolean;
  error: string | null;
  // eslint-disable-next-line
  fetchSubtasks: (taskId: string) => Promise<void>;
  // eslint-disable-next-line
  addSubtask: (taskId: string, title: string) => Promise<void>;
  // eslint-disable-next-line
  updateSubtask: (
    // eslint-disable-next-line
    taskId: string,
    // eslint-disable-next-line
    subtaskId: string,
    // eslint-disable-next-line
    updates: Partial<Subtask>,
  ) => Promise<void>;
  // eslint-disable-next-line
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  // eslint-disable-next-line
  reorderSubtasks: (taskId: string, subtaskIds: string[]) => Promise<void>;
  // eslint-disable-next-line
  toggleSubtask: (
    // eslint-disable-next-line
    taskId: string,
    // eslint-disable-next-line
    subtaskId: string,
    // eslint-disable-next-line
    completed: boolean,
  ) => Promise<void>;
}

export function useSubtasks(): UseSubtasksReturn {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubtasks = useCallback(async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await subtasksAPI.getAll(taskId);
      setSubtasks(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subtasks');
      setSubtasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSubtask = useCallback(
    async (taskId: string, title: string) => {
      setError(null);
      try {
        const response = await subtasksAPI.create(taskId, { title });
        setSubtasks((prev) => [...prev, response.data]);
      } catch (err: any) {
        setError(err.message || 'Failed to add subtask');
      }
    },
    [],
  );

  const updateSubtask = useCallback(
    async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
      setError(null);
      try {
        const response = await subtasksAPI.update(taskId, subtaskId, updates);
        setSubtasks((prev) =>
          prev.map((s) => (s.id === subtaskId ? response.data : s)),
        );
      } catch (err: any) {
        setError(err.message || 'Failed to update subtask');
      }
    },
    [],
  );

  const toggleSubtask = useCallback(
    async (taskId: string, subtaskId: string, completed: boolean) => {
      await updateSubtask(taskId, subtaskId, { completed });
    },
    [updateSubtask],
  );

  const deleteSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      setError(null);
      try {
        await subtasksAPI.delete(taskId, subtaskId);
        setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
      } catch (err: any) {
        setError(err.message || 'Failed to delete subtask');
      }
    },
    [],
  );

  const reorderSubtasks = useCallback(
    async (taskId: string, subtaskIds: string[]) => {
      setError(null);
      try {
        const response = await subtasksAPI.reorder(taskId, subtaskIds);
        setSubtasks(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to reorder subtasks');
      }
    },
    [],
  );

  return {
    subtasks,
    isLoading,
    error,
    fetchSubtasks,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    reorderSubtasks,
    toggleSubtask,
  };
}
