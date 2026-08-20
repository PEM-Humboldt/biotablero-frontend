import { useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import type { DemographicStatsType } from "pages/monitoring/types/stats";
import { MonitorignOverviewBars } from "pages/monitoring/outlets/initiativesMap/ui/MonitoringOverviewBars";
import { designationsDictionary } from "pages/monitoring/outlets/initiativesMap/layout/designationsDictionary";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";

export function DemographicsStats() {
  const { errors, stats } = useStats("Demographic");
  const [designation, setDesignation] =
    useState<keyof DemographicStatsType>("gender");
  const currentData = stats?.[designation];

  return (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />
      <ButtonGroup className="mx-auto">
        {Object.entries(designationsDictionary).map(([statsKey, label]) => (
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
  );
}
