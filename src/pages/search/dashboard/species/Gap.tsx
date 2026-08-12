import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";
import { gapMockByGroup } from "./gapMock";
import { data } from "react-router";

type SpeciesGroup =
  // | "all"
  "mammals" | "birds" | "reptiles" | "amphibians" | "fish" | "plants";

const speciesGroupLabels: { [K in SpeciesGroup]: string } = {
  // all: "Todos los grupos",
  mammals: "Mamiferos",
  birds: "Aves",
  reptiles: "Reptiles",
  amphibians: "Anfibios",
  fish: "Peces",
  plants: "Plantas",
};

export type GapData = {
  id: string | number;
  frequency: number[];
  bin_edges: number[];
};

const yearsAvailableMock = [2016, 2017, 2019, 2020, 2022, 2023, 2024, 2025];

const GAP_GRAPH_MAX_YEARS_VISUALIZATION_AMOUTN = 5;
const GAP_GRAPH_START_YEARS_VISUALIZATION_AMOUTN = 3;

export function Gap() {
  const [group, setGroup] = useState("");
  const [yearsAvailable, setYearsAvailable] =
    useState<number[]>(yearsAvailableMock);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [groupData, setGroupData] = useState<
    { id: string; data: { x: number; y: number }[] }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const res: GapData[] = gapMockByGroup[group === "" ? "all" : group] ?? [];

      const formattedData = res.reduce<
        { id: string; data: { x: number; y: number }[] }[]
      >((all, current) => {
        const pairedData = current.bin_edges.map((edge, idx) => ({
          x: edge,
          y: current.frequency[idx] ?? 0,
        }));

        const serie = { id: String(current.id), data: pairedData };
        all.push(serie);

        return all;
      }, []);
      const years = [...new Set(res.map((r) => Number(r.id)).sort())];

      setGroupData(formattedData);
      setYearsAvailable(years);
      setSelectedYears(
        years.slice(
          -Math.min(GAP_GRAPH_START_YEARS_VISUALIZATION_AMOUTN, years.length),
        ),
      );
    };

    void fetchData();
  }, [group]);

  const handleSelectYear = (year: number) => {
    setSelectedYears((oldYears) => {
      const newYears = oldYears.includes(year)
        ? oldYears.filter((y) => y !== year)
        : [...new Set([...oldYears, year])];

      if (newYears.length <= 0) {
        newYears.push(yearsAvailable[yearsAvailable.length - 1]);
      }

      if (newYears.length > GAP_GRAPH_MAX_YEARS_VISUALIZATION_AMOUTN) {
        newYears.shift();
      }
      return newYears;
    });
  };

  const renderData = groupData.filter((g) =>
    selectedYears.includes(Number(g.id)),
  );

  return (
    <div
      style={{
        padding: "18px 16px 10px 16px",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "10px",
          gap: "10px",
        }}
      >
        <h5
          style={{
            margin: 0,
            color: "#E23E57",
            lineHeight: 1.2,
            fontWeight: 500,
          }}
        >
          Índice de Vacíos por Registros (IVR) por km² (2019-2025)
        </h5>

        {Object.keys(speciesGroupLabels).length > 1 && (
          <>
            <label
              htmlFor="gap-species-group"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#616771",
                minWidth: "320px",
              }}
            >
              <span style={{ lineHeight: 1.1 }}>
                Selecciona el grupo Taxonómico
              </span>
            </label>

            <select
              id="gap-species-group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              style={{
                minWidth: "220px",
                padding: "10px 14px",
                border: "2px solid #8D8D8D",
                borderRadius: "8px",
                background: "#F3F3F3",
                color: "#666",
              }}
            >
              <option value="">Todos los grupos</option>
              {Object.entries(speciesGroupLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </>
        )}

        {yearsAvailable.length > 1 && (
          <>
            <label htmlFor="gap-years">
              <span style={{ lineHeight: 1.1 }}>
                Selecciona los años a visualizar
              </span>
            </label>
            {yearsAvailable.sort().map((year) => (
              <button
                key={`selectYearBtn_${year}`}
                onClick={() => handleSelectYear(year)}
                className={selectedYears.includes(year) ? "bg-accent" : ""}
              >
                {year}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="w-full h-full aspect-3/2">
        <ResponsiveLine
          data={renderData}
          margin={{ top: 10, right: 10, bottom: 60, left: 80 }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          curve="monotoneX"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Índice de Vacíos de Registros por (IVR)",
            legendOffset: 36,
            legendPosition: "middle",
            // format: xScaleType === "linear" ? (value) => `${value}` : undefined,
          }}
          axisLeft={{
            legend: "Frecuencia de unidades de 1km²",
            legendOffset: -60,
          }}
          pointSize={7}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "seriesColor" }}
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
        />
      </div>

      <p
        style={{
          margin: "-10px 0 0 0",
          textAlign: "center",
          color: "#5E6570",
        }}
      >
        0 : vacío mínimo · 1 : vacíos máximo
      </p>
    </div>
  );
}
