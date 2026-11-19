import {
  BarsData,
  BarDataValues,
  TopicData,
  LineData,
  TopicMetric,
  TopicMetadata,
  CleanDataType,
} from "pages/monitoring/types/topics";
import { topicsDateFormatter } from "pages/monitoring/utils/formatters";

/**
 * Transforms raw topic data into a compatible structure for Line charts (`LineData[]`).
 * * Groups the incoming values by a combined key of category name and measurement unit.
 * * Automatically computes confidence intervals (upper and lower bounds) based on absolute or relative limits.
 * * Ensures all data points within each series are sorted chronologically before returning.
 *
 * @param data - The raw topic payload containing groups, categories, and time-series values.
 *
 * @returns An array of series formatted for line charts, or an empty array if no groups are present.
 */
export function dataTransformLineGraph(data: TopicData) {
  if (!data?.groups) {
    return [];
  }

  const seriesMap = new Map<string, LineData>();

  data.groups.forEach((group) => {
    group.values.forEach((value) => {
      const metricName = value.indicatorType?.name
        ? `, ${value.indicatorType.name}`
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
          metricName: value.indicatorType?.name || "",
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
          x: topicsDateFormatter(value.date, value?.dateEnd),
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
 * Transforms raw topic data into a compatible structure for Bar charts (`BarsData`).
 * * Aggregates and pivots category-specific metrics into flat, date-keyed objects.
 * * Sorts the dataset chronologically based on the reconstructed timeline and returns unique series keys.
 *
 * @param data - The raw topic payload containing groups, categories, and time-series values.
 *
 * @returns An object containing the sorted bar dataset and the array of unique category keys.
 */
export function dataTransformBarGraph(data: TopicData): BarsData {
  if (!data?.groups) {
    return { values: [], keys: {} };
  }

  const dataByDate: Map<number, BarDataValues[]> = new Map();
  const dataGroupsBy = {
    date: new Set<string>(),
    name: new Set<string>(),
    parent: new Set<string>(),
    dateSorter: new Map<number, string>(),
  };

  data.groups.forEach((group) => {
    group.values.forEach((value) => {
      const key = new Date(value.date.year, value.date.month - 1).getTime();
      const date = topicsDateFormatter(value.date, value.dateEnd);
      const parentName = group.category.parent?.name ?? "";

      dataGroupsBy.date.add(date);
      dataGroupsBy.name.add(group.category.name);
      dataGroupsBy.parent.add(parentName);
      dataGroupsBy.dateSorter.set(key, date);

      const mapInfo = dataByDate.get(key) ?? [];
      mapInfo.push({
        name: group.category.name,
        commonName: group.category.description ?? "",
        value: value.value,
        date: date,
        parent: parentName,
        sortKey: key,
      });

      dataByDate.set(key, mapInfo);
    });
  });

  return {
    values: [...dataByDate.values()].flat(),
    keys: dataGroupsBy,
  };
}

/**
 * Flattens a graph dataset of `LineData[]` structure into an array of records.
 *
 * @param graphData - An array of line series (`LineData[]`) to serialize.
 *
 * @returns An array of flattened objects representing the data points, ready for CSV conversion.
 */
function serializeTopicSeries(
  graphData: LineData[],
): Record<string, number | string | undefined>[] {
  return graphData.flatMap((serie) =>
    serie.data.map((point) => ({
      id: serie.id,
      Nombre: serie.scientificName,
      ...(serie.commonName ? { "Nombre Común": serie.commonName } : {}),
      Métrica: serie.metricName,
      Fecha: point.x,
      Valor: point.y,
      ...(point.hasLimits
        ? {
            "Límite Superior": point.upperLimit,
            "Límite Inferior": point.lowerLimit,
          }
        : {}),
    })),
  );
}

/**
 * Flattens a graph dataset of `BarsData` structure into an array of records.
 *
 * @param graphData - The `BarsData` object containing nested bar data values to serialize.
 *
 * @returns An array of flattened objects representing the data points, ready for CSV conversion.
 */
function serializeTopicBars(
  graphData: BarsData,
): Record<string, number | string | undefined>[] {
  return graphData.values.map((item) => ({
    ...(item.parent ? { Grupo: item.parent } : {}),
    Nombre: item.name,
    ...(item.commonName ? { "Nombre Común": item.commonName } : {}),
    Fecha: item.date,
    Valor: item.value,
  }));
}

/**
 * Converts a topic's graph data into a formatted CSV string based on its metric type.
 * It evaluates the metric type and routes the data to the appropriate serialization strategy.
 * Automatically extracts headers, escapes internal double quotes, and formats the output.
 *
 * @param topic - An object combining the topic's metadata, data, and clean graph data (`TopicMetadata & TopicData & CleanDataType`).
 *
 * @returns A formatted CSV string representing the flattened data, or an empty string if the dataset is empty, invalid, or of an unknown type.
 */
export function graphDataToCSV(
  topic: TopicMetadata & TopicData & CleanDataType,
): string {
  let serializedData: Record<string, number | string | undefined>[] = [];

  switch (topic.topicType.id) {
    case TopicMetric.OCCUPATION_SPECIES:
    case TopicMetric.DETECTION_PROBABILITY_WITHOUT_COVARIABLES:
    case TopicMetric.SPECIES_DIVERSITY:
      serializedData = serializeTopicSeries(topic.cleanData as LineData[]);
      break;

    case TopicMetric.RELATIVE_SPECIES_USE_BY_GROUP:
    case TopicMetric.RELATIONAL_INTENSITY_INDEX:
    case TopicMetric.COLLECTIVE_ACTION_PARTICIPATION:
      serializedData = serializeTopicBars(topic.cleanData as BarsData);
      break;

    default:
      console.warn("Unknoun graph type to serialize");
  }

  if (serializedData.length === 0) {
    return "";
  }

  const headers = Object.keys(serializedData[0]);
  const csvRows = [
    headers.join(","),
    ...serializedData.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const strValue = String(value ?? "").replace(/"/g, '""');
          return `"${strValue}"`;
        })
        .join(","),
    ),
  ];

  return csvRows.join("\n");
}
