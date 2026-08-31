export const uiText = {
  windowsUiText: {
    shinkedBtn: { label: "", title: "Expandir", sr: "Expandir ventana" },
    expandedBtn: { label: "", title: "Contraer", sr: "Expandir ventana" },
  },
  mapControls: {
    labelSr: "Menu de navegación en el mapa",
    zoomInBtn: { sr: "Aumentar el tamaño del mapa", title: "Zoom in" },
    homeBtn: { sr: "Reiniciar zoom y ubicación", title: "Inicio" },
    zoomOutBtn: { sr: "Reducir el tamaño del mapa", title: "Zoom out" },
  },

  dataSheet: {
    title: "Cifras generales",
    goBackBtn: {
      title: (isInInitiative: boolean) =>
        isInInitiative ? "Volver al departamento" : "Volver al país",
      label: "",
      sr: (isInInitiative: boolean) =>
        isInInitiative ? "Volver al departamento" : "Volver al país",
    },
    goToInitiativeBtn: {
      label: "Ir a la iniciativa",
      title: "Ir a la iniciativa",
      sr: "Ir a la iniciativa",
    },
    scope: {
      initiativeDescription: (initiativeName: string) =>
        `Cifras generales de la iniciativa ${initiativeName}`,
      departmentDescription: (departmentName: string) =>
        `Cifras generales de ${departmentName}`,
      nationScope: "Colombia",
      nationDescription: "Cifras generales",
    },
  },

  stats: {
    general: {
      initiativesCount: {
        text: "Iniciativas realizando monitoreo",
        description: "Iniciativas de monitoreo activas en el área seleccionada",
        dataUnit: undefined,
      },
      collaboratorsCount: {
        text: (inInitiative: boolean) =>
          inInitiative
            ? "Colaboradores registrados en la iniciativa"
            : "Colaboradores registrados en las iniciativas",
        description: "Personas registradas como colaboradores",
        dataUnit: undefined,
      },
      monitoringArea: {
        text: (inInitiative: boolean) =>
          inInitiative
            ? "Area cubierta por la iniciativa"
            : "Area donde se realiza monitoreo comunitario",
        description: undefined,
        dataUnit: " ha",
      },
      initiativeSupport: {
        text: (inInitiative: boolean) =>
          inInitiative
            ? "Convenios que apoyan la iniciativa"
            : "Convenios apoyando las iniciativas",
        description: undefined,
        dataUnit: undefined,
      },
    },
    ecosystems: {
      preText:
        "Las ventanas de estudio del monitoreo comunitario a este nivel, abarcan los siguientes ecosistemas estratégicos:",
      noItems: "No hay ecosistemas estratégicos asociados",
    },
    demographic: {
      noStats: "No se encontraron estadísticas asociadas al área visualizada",
      postText:
        "Estas cifras muestran la composición de los colaboradores inscritos según su propia designación.",
    },
    indicators: {
      preTextMd:
        "Estas cifras muestran la distribución de los indicadores calculados según su nivel de [organización de la biodiversidad](https://conbio.onlinelibrary.wiley.com/doi/10.1111/j.1523-1739.1990.tb00309.x).",
      indicatorsAmount: (amount: number) => `Total de indicadores: ${amount}`,
      noItems: "No hay indicadores asociados",
    },
  },

  cardsAttachment: {
    initiatives: {
      title: "Iniciativas",
      gotoBtn: { title: "Ver más información", label: "Ver" },
    },
    indicators: {
      title: "Indicadores",
      gotoBtn: { title: "Ir al indicador", label: "Ir" },
    },
    noItems: "No hay informacion disponible",
  },

  mapLegend: {
    title: "Información del mapa",
    labelSr:
      "Información para la lectura del mapa y selección de departamentos",
    description:
      "Selecciona un **departamento** o **iniciativa** para ver sus cifras generales. Desde el panel lateral puedes ir a su perfil o indicadores.",
    deptSelection: {
      itemNotFound: "",
      trigger: "Selecciona un departamento",
      inputPlaceholder: "",
    },
    showDepartmentsBtn: {
      label: (enable: boolean) =>
        enable ? "División política" : "División política",
      title: (enable: boolean) =>
        enable ? "Mostrar división política" : "Ocultar división política",
      sr: (enable: boolean) =>
        enable ? "Mostrar división política" : "Ocultar división política",
    },
    legends: {
      initiative: "Iniciativas",
      nearByInitiatives: "Iniciativas cercanas",
      initiativesPerDepartment: "Iniciativas por departamento",
    },
    layerSelector: {
      label: "Selecciona la capa que deseas ver",
      title: "Mapas y capas",
      mapsTitle: "Mapas",
      layersTitle: "Capas",
    },
  },
};
