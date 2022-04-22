export const transformPAValues = (rawData, totalArea) => {
  if (!rawData) return [];
  let PATotalArea = 0;
  if (rawData.length > 0) {
    PATotalArea = rawData.map((i) => i.area).reduce((prev, next) => prev + next);
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
    label: 'No Protegida',
    key: 'No Protegida',
    percentage: noProtectedArea / totalArea,
  });
  return data;
};

export const transformCoverageValues = (rawData) => {
  if (!rawData) return [];
  return rawData.map((item) => {
    let label = '';
    switch (item.type) {
      case 'N':
        label = 'Natural';
        break;
      case 'S':
        label = 'Secundaria';
        break;
      case 'T':
        label = 'Transformada';
        break;
      default:
        label = 'Sin clasificar / Nubes';
    }
    return {
      ...item,
      key: item.type,
      area: Number(item.area),
      label,
    };
  });
};

export const transformSEValues = (seRawData, SETotalArea) => {
  if (!seRawData) return [];
  return [
    {
      key: seRawData.type,
      area: Number(seRawData.area),
      percentage: seRawData.percentage,
      label: seRawData.type,
    },
    {
      key: 'NA',
      area: (SETotalArea - seRawData.area),
      percentage: (SETotalArea - seRawData.area) / SETotalArea,
    },
  ];
};
