import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { Task, TaskStatus } from '../types';

export type KanbanBoard = Record<TaskStatus, Task[]>;

interface UseTaskKanbanResult {
  data: KanbanBoard | null;
  isLoading: boolean;
  error: string | null;
}

const emptyBoard: KanbanBoard = {
  TODO: [],
  IN_PROGRESS: [],
  IN_REVIEW: [],
  DONE: []
};

export default function useTaskKanban(): UseTaskKanbanResult & { refresh: () => void } {
  const [data, setData] = useState<KanbanBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = () => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    apiClient
      .get('/tasks/kanban')
      .then((response) => {
        if (!mounted) return;
        setData(response.data.data ?? emptyBoard);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu Kanban');
        setData(emptyBoard);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanup = fetchBoard();
    return cleanup;
  }, []);

  const refresh = () => {
    fetchBoard();
  };

  return { data, isLoading, error, refresh };
}
