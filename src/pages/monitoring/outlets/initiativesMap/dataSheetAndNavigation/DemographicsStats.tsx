import { useMemo, useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import type { DemographicStatsType } from "pages/monitoring/types/stats";
import { MonitorignOverviewBars } from "pages/monitoring/outlets/initiativesMap/ui/MonitoringOverviewBars";
import { designationsDictionary } from "pages/monitoring/outlets/initiativesMap/layout/designationsDictionary";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";
import { LoadingDiv } from "@ui/LoadingDiv";

export function DemographicsStats() {
  const { errors, stats, isLoading } = useStats("Demographic");
  const [designation, setDesignation] =
    useState<keyof DemographicStatsType>("gender");
  const currentData = stats?.[designation];

  const designationsAvailable = useMemo(
    () =>
      stats
        ? Object.entries(stats).reduce<Partial<typeof designationsDictionary>>(
            (all, [designationKey, data]) => {
              const key = designationKey as keyof typeof designationsDictionary;
              if (data.length > 0 || !designationsDictionary[key]) {
                all[key] = designationsDictionary[key];
              }

              return all;
            },
            {},
          )
        : {},
    [stats],
  );

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />

      {Object.keys(designationsAvailable).length === 0 ? (
        <div className="bg-primary/10 p-4 rounded-lg">
          {uiText.stats.demographic.noStats}
        </div>
      ) : (
        <>
          <ButtonGroup className="mx-auto">
            {Object.entries(designationsAvailable).map(([statsKey, label]) => (
              <Button
                key={`graphBar${statsKey}`}
                onClick={() =>
                  setDesignation(statsKey as keyof DemographicStatsType)
                }
                variant={statsKey === designation ? "default" : "outline"}
                className="border border-primary"
                title={label.long}
              >
                {label.short}
              </Button>
            ))}
          </ButtonGroup>

          <MonitorignOverviewBars
            data={currentData}
            keysForValues={["value"]}
            keyForLeftAxisLabel="key"
            bottomAxisLabel="Personas"
          />

          <p className="text-sm text-balance text-center mb-0 mt-4">
            {uiText.stats.demographic.postText}
          </p>
        </>
      )}
    </>
  );
}
