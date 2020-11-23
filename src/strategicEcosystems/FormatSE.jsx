export const setPAValues = (arrayIn) => {
  if (!arrayIn) return [];

  const array = [...arrayIn];
  let np = array.pop();
  if (np.type !== 'No Protegida') {
    array.push(np);
    np = null;
  }
  const result = array
    .filter(item => Number(item.area) > 0)
    .map(item => ({
      ...item,
      area: Number(item.area),
      // TODO: Maybe modify backend to always return type
      label: item.type || item.label,
      key: item.type || item.label,
    }))
    .sort((first, second) => {
      if (first.area > second.area) return -1;
      if (first.area < second.area) return 1;
      return 0;
    });

  if (np) {
    result.push({
      ...np,
      key: np.type,
      area: Number(np.area),
      label: np.type,
    });
  }
  return result;
};

export const setCoverageValues = (array) => {
  if (!array) return [];
  return array.map((item) => {
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
