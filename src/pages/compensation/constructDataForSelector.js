/**
 * Set the first letter of each word to uppercase
 */
const FirstLetterUpperCase = (sentence) =>
  sentence
    .toLowerCase()
    .split(/ |-/)
    .filter((str) => str.length > 0)
    .map((str) => str[0].toUpperCase() + str.slice(1))
    .join(" ");

/**
 * Set the data structure for Selector in the Compensation Module
 */
const constructDataForCompensation = (regions) => {
  const regionsArray = [];
  const regionsList = [];
  const statusList = [];
  Object.keys(regions).forEach((regionKey) => {
    const regionId = regionKey === "null" ? "(REGION SIN ASIGNAR)" : regionKey;
    const regionLabel = FirstLetterUpperCase(regionId);
    regionsList.push({
      value: regionId,
      label: regionLabel,
    });
    const region = {
      id: regionId,
      label: regionLabel,
      detailId: "region",
      iconOption: "expand",
      idLabel: `panel1-${regionLabel.replace(/ /g, "")}`,
      projectsStates: [],
    };
    Object.keys(regions[regionKey]).forEach((statusKey) => {
      const statusId =
        statusKey === "null" ? "(ESTADO SIN ASIGNAR)" : statusKey;
      const statusLabel =
        statusId.length > 3 ? FirstLetterUpperCase(statusId) : statusId;
      if (!statusList.find((st) => st.value === statusId)) {
        statusList.push({
          value: statusId,
          label: statusLabel,
        });
      }
      region.projectsStates.push({
        id: statusId,
        label: statusLabel,
        detailId: "state",
        iconOption: "expand",
        idLabel: FirstLetterUpperCase(statusLabel).replace(/ /g, ""),
        projects: regions[regionKey][statusKey].map((project) => ({
          id_project: project.gid,
          name: FirstLetterUpperCase(project.name),
          state: project.prj_status,
          region: project.id_region,
          area: project.area_ha,
          id_company: project.id_company,
          project: project.name,
          type: "button",
          label: FirstLetterUpperCase(project.name),
        })),
      });
    });
    regionsArray.push(region);
  });
  const newProject = {
    id: "addProject",
    idLabel: "panel1-newProject",
    detailId: "region",
    iconOption: "add",
    label: "+ Agregar nuevo proyecto",
    type: "addProject",
  };
  regionsArray.push(newProject);
  statusList.push({
    value: "newState",
    label: "Agregar estado...",
  });

  return { regionsList, statusList, regions: regionsArray };
};

export default constructDataForCompensation;
