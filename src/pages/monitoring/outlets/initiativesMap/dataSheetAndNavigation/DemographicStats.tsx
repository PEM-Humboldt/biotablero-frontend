import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { useState } from "react";
import type { DemographicStatsType } from "pages/monitoring/types/stats";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { MonitorignOverviewBars } from "pages/monitoring/outlets/initiativesMap/ui/MonitoringOverviewBars";

const designationsDictionary: Record<
  keyof DemographicStatsType,
  { short: string; long: string }
> = {
  gender: {
    short: "Género",
    long: "Identidad de género",
  },
  organization: {
    short: "Organización",
    long: "Organización social",
  },
  selfRecognition: {
    short: "Autoreconocimiento",
    long: "Autoreconocimiento étnico",
  },
};

export function DemographicStats() {
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

      <p className="text-sm text-balance text-right mb-0 mt-4">
        Estas cifras muestran la composición de los colaboradores inscritos
        según su propia designación.
      </p>
    </>
  );
}
