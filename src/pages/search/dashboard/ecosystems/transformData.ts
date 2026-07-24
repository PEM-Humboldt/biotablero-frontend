import { SELabels, SEData, SEPAData } from "pages/search/types/ecosystems";
import { MetricTypesMap } from "pages/search/types/metrics";

export const transformPAValues = (
  rawData: Array<SEPAData>,
  totalArea: number,
) => {
  if (!rawData || rawData.length === 0) return [];
  const totalAreaValue = Number.isFinite(Number(totalArea))
    ? Number(totalArea)
    : 0;
  const { PATotalArea, data } = rawData.reduce(
    (acc, item) => {
      const area = Number.isFinite(Number(item.area)) ? Number(item.area) : 0;
      acc.PATotalArea += area;

      if (area > 0) {
        acc.data.push({
          area,
          label: item.type,
          key: item.type,
          percentage: totalAreaValue > 0 ? area / totalAreaValue : 0,
        });
      }

      return acc;
    },
    {
      PATotalArea: 0,
      data: [] as Array<{
        area: number;
        label: string;
        key: string;
        percentage: number;
      }>,
    },
  );

  data.sort((first, second) => {
    if (first.area > second.area) return -1;
    if (first.area < second.area) return 1;
    return 0;
  });
  const noProtectedArea = totalAreaValue > 0 ? totalAreaValue - PATotalArea : 0;
  data.push({
    area: noProtectedArea,
    label: "No Protegida",
    key: "No Protegida",
    percentage: totalAreaValue > 0 ? noProtectedArea / totalAreaValue : 0,
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

export const transformSEValues = (seRawData: SEData, SETotalArea: number) => {
  if (!seRawData) return [];
  const seArea = Number.isFinite(Number(seRawData.area))
    ? Number(seRawData.area)
    : 0;
  const totalArea = Number.isFinite(Number(SETotalArea))
    ? Number(SETotalArea)
    : 0;
  const percentage = Number.isFinite(Number(seRawData.percentage))
    ? Number(seRawData.percentage)
    : 0;
  const transformedData = [
    {
      key: seRawData.type,
      area: seArea,
      percentage,
      label: SELabels[seRawData.type],
    },
    {
      key: "NA",
      area: totalArea - seArea,
      percentage: totalArea > 0 ? (totalArea - seArea) / totalArea : 0,
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
  const generalAreaValue = Number.isFinite(Number(generalArea))
    ? Number(generalArea)
    : 0;
  const transformedSEAData: Array<SEData> = rawData.map((obj) => ({
    ...obj,
    area: Number.isFinite(Number(obj.area)) ? Number(obj.area) : 0,
    percentage:
      generalAreaValue > 0
        ? (Number.isFinite(Number(obj.area)) ? Number(obj.area) : 0) /
          generalAreaValue
        : 0,
  }));
  return transformedSEAData;
};
