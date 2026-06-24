import { getStats } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { StatsResponseMap, StatsType } from "pages/monitoring/types/stats";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export function useStats<T extends StatsType>(type: T) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [stats, setStats] = useState<StatsResponseMap[T] | null>(null);
  const { departmentId, initiativeId } = useParams();

  useEffect(() => {
    const fetchStatsData = async () => {
      setIsLoading(true);
      setErrors([]);
      const res = await getStats(
        type,
        departmentId ? Number(departmentId) : undefined,
        initiativeId ? Number(initiativeId) : undefined,
      );
      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setStats(res);
    };

    void fetchStatsData();
  }, [departmentId, initiativeId, type]);

  return { isLoading, errors, stats };
}
