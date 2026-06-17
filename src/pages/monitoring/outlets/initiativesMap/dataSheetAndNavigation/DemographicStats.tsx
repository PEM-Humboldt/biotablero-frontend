import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";

export function DemographicStats() {
  const { isLoading, errors, stats } = useStats("Demographic");

  return (
    <div className="h-100">
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />
      {stats?.gender && stats.gender.length > 0 && (
        <DemographicBar data={stats.gender} />
      )}
    </div>
  );
}

function DemographicBar({ data }) {
  return (
    <ResponsiveBar
      data={data}
      keys={["value"]} // El campo numérico que define el largo de la barra
      indexBy="key" // El campo de texto que define la etiqueta de cada barra
      layout="horizontal" // Mantiene las barras acostadas de forma ordenada
      margin={{ top: 10, right: 30, bottom: 50, left: 160 }} // Más margen izquierdo para los textos largos
      padding={0.3}
      colors={{ scheme: "pastel1" }}
      axisBottom={{
        legend: "Cantidad de personas",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
    />
  );
}
