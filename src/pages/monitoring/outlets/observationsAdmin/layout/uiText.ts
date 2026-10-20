import { LOCALE } from "@config/global";

export const uiText = {
  mainHeader: {
    pageTitle: { title: "Administrar Observaciones", subtitle: "" },
    title: "Administrar Observaciones",
    uploadObservationBtn: {
      label: "Cargar observaciones",
      sr: "Cargar información de observaciones a una iniciativa",
      title: "Cargar observaciones a una iniciativa",
    },
  },

  initiativeSearch: {
    sectionLabel: "Filtrar iniciativas por nombre",
    input: {
      placeholder: "Nombre de la iniciativa",
      restartBtn: {
        label: "",
        sr: "Deshacer búsqueda",
        title: "Deshacer búsqueda",
      },
    },

    selectInitiativeBtn: {
      label: "",
      sr: "Ver Observaciones de la iniciativa",
      title: "Ver Observaciones de la iniciativa",
    },

    deselectInitiativeBtn: {
      label: "",
      sr: "Deseleccionar la iniciativa",
      title: "Deseleccionar la iniciativa",
    },
  },

  observationsList: {
    noInitiative:
      "Selecciona una iniciativa para poder administrar sus observaciones",
    loadind: "Cargando información de las observaciones...",

    listDescription: { sr: "Observaciones relacionadas" },
    versionsListDescription: {
      sr: "Selecciona la varsion para revisar",
      label: "Versiones",
    },
    versionsListDescriptionEdit: {
      sr: "Selecciona la version a editar",
      label: "Selecciona la version a editar",
    },
    openVersionBtn: {
      sr: (version: number, observationDate: Date) =>
        `Ver la version ${version} de ${observationDate.toLocaleDateString(LOCALE)}`,
      title: (version: number, observationDate: Date) =>
        `Ver la version ${version} de ${observationDate.toLocaleDateString(LOCALE)}`,
      label: (_version: number, observationDate: Date) =>
        observationDate.toLocaleDateString(LOCALE),
    },
  },

  observationVersionCard: {},
};
