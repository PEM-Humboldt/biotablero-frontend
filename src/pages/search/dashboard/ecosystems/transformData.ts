import {
  Coverage,
  SEPAData,
  coverageLabels,
  SEPADataExt,
  coverageType,
} from "pages/search/types/ecosystems";

export const transformPAValues = (
  rawData: Array<SEPAData>,
  totalArea: number
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

export const transformCoverageValues = (rawData: Array<Coverage>) => {
  if (!rawData) return [];
  return rawData.map((item) => {
    let label: coverageLabels = "";
    switch (item.type) {
      case "N":
        label = "Natural";
        break;
      case "S":
        label = "Secundaria";
        break;
      case "T":
        label = "Transformada";
        break;
      default:
        label = "Sin clasificar / Nubes";
    }
    return {
      ...item,
      key: item.type,
      area: Number(item.area),
      label,
    };
  });
};

export const transformSEValues = (
  seRawData: SEPADataExt,
  SETotalArea: number
) => {
  if (!seRawData) return [];
  const transformedData = [
    {
      key: seRawData.type,
      area: Number(seRawData.area),
      percentage: seRawData.percentage,
      label: seRawData.type,
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
  rawData: Array<SEPAData>,
  generalArea: number
) => {
  if (!rawData) return [];
  const transformedSEAData: Array<SEPADataExt> = rawData.map((obj) => ({
    ...obj,
    percentage: obj.area / generalArea,
  }));
  return transformedSEAData;
};
