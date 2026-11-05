import { LOCALE } from "@config/global";

export const uiText = {
  mainHeader: {
    pageTitle: { title: "Administrar Temáticas", subtitle: "" },
    title: "Administrar temáticas",
    uploadTopicBtn: {
      label: "Cargar temáticas",
      sr: "Cargar información de temáticas asociadas a una iniciativa",
      title: "Cargar temáticas asociadas a una iniciativa",
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
      sr: "Ver temáticas de la iniciativa",
      title: "Ver termáticas de la iniciativa",
    },

    deselectInitiativeBtn: {
      label: "",
      sr: "Deseleccionar la iniciativa",
      title: "Deseleccionar la iniciativa",
    },
  },

  topicsList: {
    noInitiative:
      "Selecciona una iniciativa para poder administrar sus temáticas",
    loadind: "Cargando información de las temáticas...",

    listDescription: { sr: "Temáticas relacionadas" },
    versionsListDescription: {
      sr: "Selecciona la varsion para revisar",
      label: "Versiones",
    },
    versionsListDescriptionEdit: {
      sr: "Selecciona la versión a editar",
      label: "Selecciona la versión a editar",
    },
    openVersionBtn: {
      sr: (version: number, topicDate: Date) =>
        `Ver la version ${version} de ${topicDate.toLocaleDateString(LOCALE)}`,
      title: (version: number, topicDate: Date) =>
        `Ver la version ${version} de ${topicDate.toLocaleDateString(LOCALE)}`,
      label: (_version: number, topicDate: Date) =>
        topicDate.toLocaleDateString(LOCALE),
    },
  },

  topicVersionCard: {
    saveBtn: {
      sr: "Guardar cambios",
      title: "Guardar cambios",
      label: "Guardar",
    },
    cancelBtn: { sr: "Cancelar", title: "Cancelar", label: "Cancelar" },
    updatedToast: {
      title: "Textos de version actualizados",
      description: (versionNumber: number, creationDate: Date) =>
        `Los textos esta temática en la version ${versionNumber} de ${creationDate.toLocaleDateString(LOCALE)} han sido actualizados correctamente.`,
    },
    editVersionTitlePrefix: "Version del ",
    noTextInThisVersion: (textField: string) =>
      `No hay textos asociados con '${textField}' en esta versión de la temática`,
    textEditorPlaceHolder: "Este indicador...",
  },
};
