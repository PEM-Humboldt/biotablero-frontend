import {
  SELabels,
  SEData,
  SEDataExtended,
  SEPAData,
} from "pages/search/types/ecosystems";
import { MetricTypesMap } from "pages/search/types/metrics";

export const transformPAValues = (
  rawData: Array<SEPAData>,
  totalArea: number,
) => {
  if (!rawData || rawData.length === 0) return [];
  let PATotalArea = 0;
  if (rawData.length > 0) {
    PATotalArea = rawData
      .map((i) => i.area)
      .reduce((prev, next) => prev + next);
  }
  const data = rawData
    .filter((item) => item.area > 0)
    .map((item) => ({
      area: item.area,
      label: item.type,
      key: item.type,
      percentage: item.area / totalArea,
    }))
    .sort((first, second) => {
      if (first.area > second.area) return -1;
      if (first.area < second.area) return 1;
      return 0;
    });
  const noProtectedArea = totalArea > 0 ? totalArea - PATotalArea : 0;
  data.push({
    area: noProtectedArea,
    label: "No Protegida",
    key: "No Protegida",
    percentage: noProtectedArea / totalArea,
  });
  return data;
};

export const transformCoverageValues = (
  rawData: MetricTypesMap["coverage"],
) => {
  if (!rawData) return [];

  const { id, ...classes } = rawData;
  const items = [];
  let totalArea = 0;
  for (const [key, value] of Object.entries(classes)) {
    items.push({ key, label: key, area: value });
    totalArea += value;
  }

  return items.map((item) => ({
    area: item.area,
    key: item.key,
    percentage: totalArea > 0 ? item.area / totalArea : 0,
    label: item.label,
  }));
};

export const transformSEValues = (
  seRawData: SEDataExtended,
  SETotalArea: number,
) => {
  if (!seRawData) return [];
  const transformedData = [
    {
      key: seRawData.type,
      area: Number(seRawData.area),
      percentage: seRawData.percentage,
      label: SELabels[seRawData.type],
    },
    {
      key: "NA",
      area: SETotalArea - seRawData.area,
      percentage: (SETotalArea - seRawData.area) / SETotalArea,
      label: "",
    },
  ];
  return transformedData;
};

export const transformSEAreas = (
  rawData: Array<SEData>,
  generalArea: number,
) => {
  if (!rawData) return [];
  const transformedSEAData: Array<SEDataExtended> = rawData.map((obj) => ({
    ...obj,
    percentage: obj.area / generalArea,
  }));
  return transformedSEAData;
};
