import { useEffect, useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";

import type { UserStats } from "pages/monitoring/types/user";
import { getUserStats } from "pages/monitoring/api/services/user";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { uiText } from "pages/monitoring/outlets/myProfile/layout/uiText";

export function UserStats() {
  const [errors, setErrors] = useState<string[]>([]);
  const [stats, setStats] = useState<Omit<UserStats, "username"> | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      const res = await getUserStats();

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      const { username: _, ...stats } = res;
      setStats(stats as Omit<UserStats, "username">);
    };

    void fetchUserStats();
  }, []);

  return !stats ? null : (
    <>
      <ErrorsList errorItems={errors} />
      <ul
        aria-label="Mis contribuciones"
        className="flex flex-wrap gap-4 w-full *:rounded-lg *:bg-background"
      >
        {Object.entries(stats).map(([key, value]) => (
          <StatsCard
            key={`stats_${key}`}
            statName={key as keyof typeof uiText.profileStats.statsUiInfo}
            statValue={Number(value)}
          />
        ))}
      </ul>
    </>
  );
}

function StatsCard({
  statName,
  statValue,
}: {
  statName: keyof typeof uiText.profileStats.statsUiInfo;
  statValue: number;
}) {
  const Icon = uiText.profileStats.statsUiInfo[statName].icon;
  const text = uiText.profileStats.statsUiInfo[statName].text;

  return (
    <li className="flex flex-[1_1_200px] flex-col justify-center gap-2 items-center p-4">
      <span className="bg-grey-light p-4 rounded-full w-fit" aria-hidden="true">
        <Icon className="size-12 text-primary" strokeWidth={1} />
      </span>
      <span className="text-primary text-5xl font-bold">{statValue}</span>
      <span className="text-center text-balance font-normal text-lg/6">
        {text}
      </span>
    </li>
  );
}
