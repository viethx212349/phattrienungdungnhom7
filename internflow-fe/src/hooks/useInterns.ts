import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Intern } from "../types/intern";
import { InternStatus } from "../types/intern";

interface UseInternsParams {
  page: number;
  limit: number;
}

export const useInterns = ({ page, limit }: UseInternsParams) => {
  const [data, setData] = useState<Intern[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterns = () => {
    setIsLoading(true);
    api.getInterns().then((res) => {
      const mapped: Intern[] = res.map((i: any) => ({
        id: i.id,
        fullName: i.full_name,
        code: i.intern_code,
        position: i.position || "N/A",
        email: i.email || "N/A",
        phone: i.phone || "N/A",
        status: i.status === "ACTIVE" ? InternStatus.INTERNING : (i.status === "FAILED" ? InternStatus.FAIL : InternStatus.PASSED)
      }));
      setData(mapped);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchInterns();
  }, [page, limit]);

  return {
    data,
    isLoading,
    total: data.length,
    refetch: fetchInterns
  };
};