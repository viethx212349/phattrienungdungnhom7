import { useEffect, useState } from "react";
import { mockInterns } from "../data/mockInterns";
import type { Intern } from "../types/intern";

interface UseInternsParams {
  page: number;
  limit: number;
}

export const useInterns = ({ page, limit }: UseInternsParams) => {
  const [data, setData] = useState<Intern[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
         
      setData(mockInterns.slice(start, end));
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [page, limit]);

  return {
    data,
    isLoading,
    total: mockInterns.length,
  };
};