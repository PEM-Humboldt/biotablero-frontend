import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { ResponsiveBar } from "@nivo/bar";
import { useState } from "react";
import type {
  BarsInfo,
  DemographicStatsType,
} from "pages/monitoring/types/stats";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

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

const MONITORING_STATS_BAR_HEIGHT = 30;
const MONITORING_STATS_GRAPH_Y_MARGINS = 80;

export function DemographicStats() {
  const { isLoading, errors, stats } = useStats("Demographic");
  const [designation, setDesignation] =
    useState<keyof DemographicStatsType>("gender");
  const currentData = stats?.[designation];

  const chartHeight =
    currentData && currentData.length > 0
      ? currentData.length * MONITORING_STATS_BAR_HEIGHT +
        MONITORING_STATS_GRAPH_Y_MARGINS
      : 200;

  return (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />
      <ButtonGroup className="mx-auto">
        {Object.entries(designationsDictionary).map(([statsKey, label]) => (
          <Button
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
      <div style={{ height: `${chartHeight}px`, width: "100%" }}>
        {currentData && <DemographicBar data={currentData} />}
      </div>
      <p className="text-sm mb-0">
        Estas cifras muestran la composición de los colaboradores inscritos
        según su propia designación
      </p>
    </>
  );
}

function DemographicBar({ data }: { data: BarsInfo[] }) {
  const maxDataValue = Math.max(...data.map((d) => d.value), 0);
  const graphMaxValue = maxDataValue + 1;

  return (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      valueScale={{
        type: "linear",
        max: graphMaxValue,
      }}
      indexBy="key"
      layout="horizontal"
      groupMode="grouped"
      margin={{ top: 20, right: 10, bottom: 40, left: 120 }}
      padding={0.1}
      colorBy="indexValue"
      colors={{ scheme: "pastel1" }}
      axisBottom={{
        legend: "Personas",
        legendPosition: "middle",
        legendOffset: 30,
        format: (value: number) => (Number.isInteger(value) ? value : ""),
        tickValues: graphMaxValue,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        format: (value) => {
          const text = String(value);
          return text.length > 20 ? `${text.substring(0, 17)}...` : text;
        },
        tickRotation: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
    />
  );
}
