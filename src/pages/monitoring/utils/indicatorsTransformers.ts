import type {
  BarDatavalues,
  BarsData,
  IndicatorData,
  LineData,
} from "pages/monitoring/types/indicators";
import { indicatorsDateFormatter } from "pages/monitoring/utils/formatters";

/**
 * Transforms raw indicator data into a compatible structure for Line charts (`LineData[]`).
 * * Groups the incoming values by a combined key of category name and measurement unit.
 * * Automatically computes confidence intervals (upper and lower bounds) based on absolute or relative limits.
 * * Ensures all data points within each series are sorted chronologically before returning.
 *
 * @param data - The raw indicator payload containing groups, categories, and time-series values.
 *
 * @returns An array of series formatted for line charts, or an empty array if no groups are present.
 */
export function dataTransformLineGraph(data: IndicatorData) {
  if (!data?.groups) {
    return [];
  }

  const seriesMap = new Map<string, LineData>();

  data.groups.forEach((group) => {
    group.values.forEach((value) => {
      const metricName = value.measureUnit?.name
        ? ` || ${value.measureUnit.name}`
        : "";
      const seriesDescription = group.category?.description
        ? `, ${group.category.description}`
        : "";
      const seriesId = `${group.category.name}${seriesDescription}${metricName}`;

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
          x: indicatorsDateFormatter(value.date, value.dateEnd),
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

/**
 * Transforms raw indicator data into a compatible structure for Bar charts (`BarsData`).
 * * Aggregates and pivots category-specific metrics into flat, date-keyed objects.
 * * Sorts the dataset chronologically based on the reconstructed timeline and returns unique series keys.
 *
 * @param data - The raw indicator payload containing groups, categories, and time-series values.
 *
 * @returns An object containing the sorted bar dataset and the array of unique category keys.
 */
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
      const date = indicatorsDateFormatter(value.date, value.dateEnd);
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, sortKey });
      }

      dateMap.get(date)![key] = value.value;
    });
  });

  return {
    data: Array.from(dateMap.values()).sort((a, b) => a.sortKey - b.sortKey),
    keys: [...keys],
  };
}
