/**
 * Set the first letter of each word to uppercase
 */
const FirstLetterUpperCase = (sentence) => (
  sentence
    .toLowerCase()
    .split(/ |-/)
    .filter((str) => str.length > 0)
    .map((str) => str[0].toUpperCase() + str.slice(1))
    .join(' ')
);

/**
 * Set the data structure for Selector in the Search Module
 */
const constructDataForSearch = (geofences) => {
  const areasArray = [];
  geofences.forEach((geofence) => {
    const area = {
      id: geofence.id,
      label: geofence.name,
      detailId: 'area',
      iconOption: 'expand',
      idLabel: `panel1-${geofence.id}`,
      options: geofence.data,
      disabled: (geofence.id === 'se'),
    };
    areasArray.push(area);
  });

  const geofencesArray = [
    {
      id: 'Geocerca',
      idLabel: 'panel1-Geocerca',
      detailId: 'geofences',
      label: 'Área de consulta',
      options: areasArray,
    },
    {
      id: 'draw',
      idLabel: 'panel2',
      detailId: 'panel2',
      label: 'Dibujar polígono',
      iconOption: 'edit',
      text: 'Usa el botón de polígono dentro del mapa, finaliza o cierra el polígono y confirma cuando sea el polígono a consultar',
      options: [
        {
          id: 'Confirmar',
          idLabel: 'Confirmar polígono',
          label: 'Confirmar polígono',
          iconOption: 'confirm',
          detailId: 'area',
        },
        {
          id: 'Borrar',
          idLabel: 'Borrar polígono',
          label: 'Borrar polígono',
          iconOption: 'remove',
          detailId: 'area',
        },
      ],
    },
    {
      id: 'panel3',
      detailId: 'panel3',
      label: 'Subir polígono',
      iconOption: 'upload',
      disabled: true,
    },
  ];
  return geofencesArray;
};

/**
 * Set the data structure for Selector in the Compensation Module
 */
const constructDataForCompensation = (regions) => {
  const regionsArray = [];
  const regionsList = [];
  const statusList = [];
  Object.keys(regions).forEach((regionKey) => {
    const regionId = (regionKey === 'null') ? '(REGION SIN ASIGNAR)' : regionKey;
    const regionLabel = FirstLetterUpperCase(regionId);
    regionsList.push({
      value: regionId,
      label: regionLabel,
    });
    const region = {
      id: regionId,
      label: regionLabel,
      detailId: 'region',
      iconOption: 'expand',
      idLabel: `panel1-${regionLabel.replace(/ /g, '')}`,
      projectsStates: [],
    };
    Object.keys(regions[regionKey]).forEach((statusKey) => {
      const statusId = (statusKey === 'null') ? '(ESTADO SIN ASIGNAR)' : statusKey;
      const statusLabel = (statusId.length > 3)
        ? FirstLetterUpperCase(statusId) : statusId;
      if (!statusList.find((st) => st.value === statusId)) {
        statusList.push({
          value: statusId,
          label: statusLabel,
        });
      }
      region.projectsStates.push({
        id: statusId,
        label: statusLabel,
        detailId: 'state',
        iconOption: 'expand',
        idLabel: FirstLetterUpperCase(statusLabel).replace(/ /g, ''),
        projects: regions[regionKey][statusKey].map((project) => ({
          id_project: project.gid,
          name: FirstLetterUpperCase(project.name),
          state: project.prj_status,
          region: project.id_region,
          area: project.area_ha,
          id_company: project.id_company,
          project: project.name,
          type: 'button',
          label: FirstLetterUpperCase(project.name),
        })),
      });
    });
    regionsArray.push(region);
  });
  const newProject = {
    id: 'addProject',
    idLabel: 'panel1-newProject',
    detailId: 'region',
    iconOption: 'add',
    label: '+ Agregar nuevo proyecto',
    type: 'addProject',
  };
  regionsArray.push(newProject);
  statusList.push({
    value: 'newState',
    label: 'Agregar estado...',
  });

  return { regionsList, statusList, regions: regionsArray };
};

export { constructDataForSearch, constructDataForCompensation };
