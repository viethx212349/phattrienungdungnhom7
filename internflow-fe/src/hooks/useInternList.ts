import { useEffect, useMemo, useState } from 'react';
import { Intern } from '../types';
import apiClient from '../lib/apiClient';

interface UseInternListOptions {
  page: number;
  limit: number;
  refreshKey?: number;
}

export interface UseInternListResult {
  data: Intern[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  error?: string | null;
}

// mock data removed; hook now fetches from backend

export default function useInternList({ page, limit, refreshKey }: UseInternListOptions): UseInternListResult {
  const [isLoading, setIsLoading] = useState(true);
  const [allData, setAllData] = useState<Intern[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    apiClient
      .get('/interns')
      .then((response) => {
        if (!mounted) return;
        setAllData(response.data.data ?? []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || err.message || 'Lỗi khi tải danh sách intern');
        setAllData([]);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, limit, refreshKey]);

  const start = (page - 1) * limit;
  const data = useMemo(() => allData.slice(start, start + limit), [allData, start, limit]);

  return {
    data,
    isLoading,
    page,
    limit,
    total: allData.length,
    error,
  };
}
