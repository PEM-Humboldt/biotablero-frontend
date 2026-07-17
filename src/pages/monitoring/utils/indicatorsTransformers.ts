import { LOCALE } from "@config/monitoring";
import {
  type BarDatavalues,
  type BarsData,
  type IndicatorData,
  type IndicatorGroup,
  type LineData,
} from "pages/monitoring/types/indicators";

/**
 * Formats a single date or a date range into a localized, human-readable string.
 *
 * @param year - The starting year.
 * @param month - The starting month (1-indexed).
 * @param endYear - The optional ending year for a range.
 * @param endMonth - The optional ending month (1-indexed) for a range.
 * @returns A localized date or range string based on the `LOCALE` configuration.
 */
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

/**
 * Transforms raw indicator data into a compatible structure for Bar charts (`BarsData`).
 * * Aggregates and pivots category-specific metrics into flat, date-keyed objects.
 * * Sorts the dataset chronologically based on the reconstructed timeline and returns unique series keys.
 *
 * @param data - The raw indicator payload containing groups, categories, and time-series values.
 *
 * @returns An object containing the sorted bar dataset and the array of unique category keys.
 */
export function dataTransformBarGraph(
  data: IndicatorData | IndicatorGroup[],
): BarsData {
  const rawData = Array.isArray(data) ? data : data?.groups;

  if (!rawData) {
    return { data: [], keys: [] };
  }

  const keys = new Set<string>();
  const dateMap = new Map<string, BarDatavalues>();

  rawData.forEach((group) => {
    const key = group.category.name;
    keys.add(key);

    group.values.forEach((value) => {
      const sortKey = new Date(value.date.year, value.date.month, 1).getTime();
      const date = displayDate(
        value.date.year,
        value.date.month,
        value.dateEnd?.year,
        value.dateEnd?.month,
      );

      if (!dateMap.has(date)) {
        dateMap.set(date, { date, sortKey });
      }

      dateMap.get(date)![key] = value.value;
    });
  });

  const sortedData = Array.from(dateMap.values()).sort(
    (a, b) => a.sortKey - b.sortKey,
  );

  return {
    data: sortedData,
    keys: Array.from(keys),
  };
}
