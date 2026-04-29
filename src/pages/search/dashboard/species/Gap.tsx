import React, { useMemo, useState } from "react";
import Lines from "@composites/charts/Lines";
import {
  gapMockByGroup,
  speciesGroupOptions,
  type SpeciesGroupKey,
} from "pages/search/dashboard/species/gapMock";

interface LineSerie {
  key: string;
  label: string;
  data: {
    x: string;
    y: number;
  }[];
}

const SERIES_YEARS = [2019, 2021, 2023, 2025] as const;
const X_MIN = 0.3;
const X_MAX = 0.95;

const yearColors: Record<number, string> = {
  2019: "#303F8C",
  2021: "#089FA7",
  2023: "#E69A00",
  2025: "#B54A00",
};

const getYearColor = (key: string | number) => {
  const keyString = String(key);
  const keyMatch = keyString.match(/(\d{4})/);
  const year = keyMatch ? Number(keyMatch[1]) : NaN;
  return yearColors[year] || "#8C8C8C";
};

export function Gap() {
  const [selectedGroup, setSelectedGroup] = useState<SpeciesGroupKey>("all");

  const gapData = gapMockByGroup[selectedGroup];

  const transformedData: LineSerie[] = useMemo(() => {
    return gapData.map((serie, index) => {
      const points = serie.histogram
        .map((value, i) => {
          const end = serie.bin_edges[i + 1];
          if (end === undefined) return null;
          if (end < X_MIN || end > X_MAX) return null;

          return {
            x: end.toFixed(2),
            y: value,
          };
        })
        .filter((point): point is { x: string; y: number } => point !== null);

      const year = SERIES_YEARS[index] ?? Number(serie.id) ?? 2000 + index;

      return {
        key: `gap_${year}`,
        label: `${year}`,
        data: points,
      };
    });
  }, [gapData]);

  const yMax = useMemo(() => {
    const maxValue = transformedData.reduce((seriesMax, serie) => {
      const maxInSerie = serie.data.reduce(
        (pointMax, point) => Math.max(pointMax, point.y),
        0,
      );
      return Math.max(seriesMax, maxInSerie);
    }, 0);

    if (maxValue <= 0) return 20;

    return Math.ceil(maxValue * 1.15);
  }, [transformedData]);

  if (transformedData.length === 0) return null;

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
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "6px",
          gap: "12px",
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

        <label
          htmlFor="gap-species-group"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#616771",
            minWidth: "320px",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ lineHeight: 1.1 }}>Grupo Taxonómico</span>
          <select
            id="gap-species-group"
            value={selectedGroup}
            onChange={(e) =>
              setSelectedGroup(e.target.value as SpeciesGroupKey)
            }
            style={{
              minWidth: "220px",
              padding: "10px 14px",
              border: "2px solid #8D8D8D",
              borderRadius: "8px",
              background: "#F3F3F3",
              color: "#666",
            }}
          >
            {speciesGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Lines
        data={transformedData}
        labelX="Índice de Vacíos de Registros por (IVR)"
        labelY="Frecuencia de unidades de 1km²"
        height={420}
        yMin={0}
        yMax={yMax}
        colors={getYearColor}
        legendAnchor="top-left"
        legendTranslateX={0}
        legendTranslateY={-16}
        enableGridX={false}
        loadStatus={null}
      />

      <p
        style={{
          margin: "-10px 0 0 0",
          textAlign: "center",
          color: "#5E6570",
        }}
      >
        0 : vacío mínimo - lugar bien muestreado · 1 : vacíos máximo - lugar mal
        muestreado
      </p>
    </div>
  );
}
