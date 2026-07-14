import { LOCALE } from "@config/monitoring";
import type {
  BarDatavalues,
  BarsData,
  IndicatorData,
  LineData,
} from "pages/monitoring/types/indicators";

function displayDate(
  year: number,
  month: number,
  endYear?: number,
  endMonth?: number,
): string {
  const startDate = new Date(year, month - 1, 1);

  if (endMonth && endYear) {
    const endDate = new Date(endYear, endMonth - 1, 1);

    const startStr = startDate.toLocaleDateString(LOCALE, { month: "short" });
    const endStr = endDate.toLocaleDateString(LOCALE, {
      month: "short",
      year: "numeric",
    });

    return `${startStr} - ${endStr}`;
  }

  return startDate.toLocaleDateString(LOCALE, {
    month: "short",
    year: "numeric",
  });
}

export function dataTransformLineGraph(data: IndicatorData) {
  if (!data?.groups) {
    return [];
  }

  const seriesMap = new Map<string, LineData>();

  data.groups.forEach((group) => {
    group.values.forEach((value) => {
      const metricName = value.measureUnit?.name
        ? ` - ${value.measureUnit.name}`
        : "";
      const seriesId = `${group.category.name}${metricName}`;

      if (!seriesMap.has(seriesId)) {
        seriesMap.set(seriesId, {
          id: seriesId,
          scientificName: group.category?.name || `Group ${group.id}`,
          commonName: group.category?.description || "",
          metricName: value.measureUnit?.name || "",
          data: [],
        });
      }

      const hasLimits =
        value.upperLimit !== undefined && value.lowerLimit !== undefined;
      const isAbsolute =
        value.upperLimit !== undefined && value.upperLimit > value.value;
      const upperBound = isAbsolute
        ? value.upperLimit
        : value.value + (value.upperLimit || 0);
      const lowerBound = isAbsolute
        ? value.lowerLimit
        : value.value - (value.lowerLimit || 0);

      const serie = seriesMap.get(seriesId);
      if (serie) {
        serie.data.push({
          x: displayDate(
            value.date.year,
            value.date.month,
            value.dateEnd?.year,
            value.dateEnd?.month,
          ),
          y: value.value,
          upperLimit: hasLimits ? upperBound : undefined,
          lowerLimit: hasLimits ? lowerBound : undefined,
          hasLimits,
          sortKey: new Date(value.date.year, value.date.month).getTime(),
        });
      }
    });
  });

  const series = Array.from(seriesMap.values());
  series.forEach((s) => {
    s.data.sort((a, b) => a.sortKey - b.sortKey);
  });

  return series;
}

export function dataTransformBarGraph(data: IndicatorData): BarsData {
  if (!data?.groups) {
    return { data: [], keys: [] };
  }
  const keys = new Set<string>();
  const dateMap = new Map<string, BarDatavalues>();

  data.groups.forEach((group) => {
    const key = group.category.name;
    keys.add(key);

    group.values.forEach((value) => {
      const sortKey = new Date(value.date.year, value.date.month).getTime();
      const date = displayDate(
        value.date.year,
        value.date.month,
        value.dateEnd?.year,
        value.dateEnd?.month,
      );

      if (!dateMap.has(date)) {
        dateMap.set(date, { date, sortKey });
      }

      dateMap.get(date)![key] = value.value * 1000000;
    });
  });

  return {
    data: Array.from(dateMap.values()).sort((a, b) => a.sortKey - b.sortKey),
    keys: [...keys],
  };
}
