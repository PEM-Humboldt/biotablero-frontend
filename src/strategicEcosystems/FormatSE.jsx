export const setPAValues = (array) => {
  const responseObject = [];
  let counter = -1;
  const colorsProtectedAreas = [
    '#b3b638',
    '#62591e',
    '#59651f',
    '#7b6126',
    '#5f8f2c',
    '#92ba3a',
    '#a5a95b',
  ];
  if (array) {
    array.forEach((item) => {
      let color;
      switch (item.type) {
        case 'Total':
          color = '#fff';
          break;
        case 'No Protegida':
          color = '#9d9d9d';
          break;
        default:
          color = colorsProtectedAreas[counter];
      }
      responseObject.push({
        area: Number(item.area),
        percentage: Number(item.percentage),
        type: item.type,
        color,
      });
      counter += (1 % (colorsProtectedAreas.length / counter));
    });
  }
  return Object.values(responseObject);
};

export const setCoverageValues = (array) => {
  const responseObject = {};
  if (array) {
    array.forEach((item) => {
      let local;
      let color;
      switch (item.type) {
        case 'Total':
          local = item.type;
          color = '#fff';
          break;
        case 'N':
          local = 'Natural';
          color = '#164f74';
          break;
        case 'S':
          local = 'Secundaria';
          color = '#60bbd4';
          break;
        case 'T':
          local = 'Transformada';
          color = '#5aa394';
          break;
        default:
          local = 'Sin clasificar / Nubes';
          color = '#9d9d9d';
      }
      if (responseObject[local]) {
        responseObject[local].area += Number(item.area);
        responseObject[local].percentage += Number(item.percentage);
      } else {
        responseObject[local] = {
          area: Number(item.area),
          percentage: Number(item.percentage),
          type: local,
          color,
        };
      }
    });
  }
  return Object.values(responseObject);
};
