export const setPAValues = (array) => {
  if (!array) return null;
  const responseObject = [];
  let counter = -1;
  const colorsProtectedAreas = [
    '#59651f',
    '#92ba3a',
    '#a5a95b',
    '#5f8f2c',
  ];
  array.forEach((item) => {
    let color;
    switch (item.type) {
      case 'Total':
        color = '#fff';
        break;
      case 'No Protegida':
        color = '#b9c9cf';
        break;
      default:
        color = colorsProtectedAreas[counter] || '#b3b638';
    }
    responseObject.push({
      area: Number(item.area),
      percentage: Number(item.percentage),
      type: item.type,
      color,
    });
    counter += (1 % (colorsProtectedAreas.length / counter));
  });
  return Object.values(responseObject);
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
      label,
    };
  });
};
