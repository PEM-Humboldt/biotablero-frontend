import { useCallback, useEffect, useState } from "react";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Spinner } from "@ui/shadCN/component/spinner";

import {
  getInitiativeStats,
  getOverviewStats,
} from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import type { InitiativeStatsComplete } from "pages/monitoring/types/stats";
import { uiText } from "pages/monitoring/outlets/initiatives/layout/uiText";
import { profileStats } from "pages/monitoring/outlets/initiatives/layout/profileStats";

export function Stats() {
  const { initiativeId } = useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [initiativeStats, setInitiativeStats] =
    useState<InitiativeStatsComplete | null>(null);

  const fetchStats = useCallback(async () => {
    setInitiativeStats(null);
    if (!initiativeId) {
      return;
    }

    setIsLoading(true);
    const [generalStats, initiativeStats] = await Promise.all([
      getOverviewStats("General", undefined, Number(initiativeId)),
      getInitiativeStats(Number(initiativeId)),
    ]);

    setIsLoading(false);
    if (isMonitoringAPIError(generalStats)) {
      setErrors(generalStats.data.map((err) => err.msg));
      return;
    }

    if (isMonitoringAPIError(initiativeStats)) {
      setErrors(initiativeStats.data.map((err) => err.msg));
      return;
    }

    const initiativeFullStats = { ...generalStats, ...initiativeStats };

    setInitiativeStats(initiativeFullStats);
  }, [initiativeId]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return errors.length > 0 ? (
    <ErrorsList
      errorItems={[uiText.profile.stats.errorBase, ...errors]}
      className="bg-accent/10 border border-accent rounded-lg p-4"
    />
  ) : (
    <div className="flex flex-wrap gap-2 lg:gap-4 *:flex-1">
      {profileStats.map((stat) => {
        const displayValue = new Intl.NumberFormat("es-CO", {
          maximumFractionDigits: 0,
        }).format((initiativeStats?.[stat.valueKey] as number) ?? 0);

        return (
          <div
            key={`statInfo_${stat.title}`}
            title={stat.hoverTitle}
            className="flex shadow-sm rounded-lg p-3 items-start outline outline-transparent hover:outline-primary transition-colors duration-200"
          >
            <stat.icon
              className="size-4 lg:size-10 flex-1"
              strokeWidth={1}
              aria-hidden="true"
            />
            <div className="pl-2 flex-5 space-y-2">
              <div className="font-light text-base lg:text-lg/5 text-balance">
                {stat.title}
              </div>
              <div className="font-normal">
                <span className="text-2xl inline-flex gap-1 items-center">
                  {displayValue}
                  {isLoading && <Spinner className="size-6 text-primary" />}
                </span>
                {stat.unit && <span className="text-xl">{stat.unit}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
