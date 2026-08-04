export const uiText = {
  addToReportBtn: {
    title: {
      notLogged: "Inicia sesión para crear reportes",
      logged: (withNote: boolean) =>
        withNote
          ? `Hacer anotacion y agregar a mi reporte`
          : "Agregar a mi reporte",
    },
    sr: {
      notLogged: "Inicia sesión para crear reportes",
      logged: (withNote: boolean) =>
        withNote
          ? `Hacer anotacion y agregar a mi reporte`
          : "Agregar a mi reporte",
    },
    label: (isLoading: boolean) => (isLoading ? "Agregando..." : "Agregar"),
  },

  addNotePopover: {
    placeholder: "Mis observaciones...",
    addBtn: {
      title: "Agregar con mi anotacion",
      sr: "Agregar con mi anotacion",
      label: (isLoading: boolean) => (isLoading ? "Agregando..." : "Agregar"),
    },
    cancelBtn: {
      title: "Cancelar",
      sr: "Cancelar y cerrar",
      label: "Cancelar",
    },
  },

  dropdownMenu: {
    indicatorElements: {
      title: "Indicador",
      addWithoutNoteBtn: "Agregar",
      addWithNoteBtn: "Agregar con anotación",
    },
    reportElements: {
      title: "Reporte",
      editBtn: "Editar",
      downloadBtn: "Descargar",
      deleteBtn: "Borrar",
    },
  },

  downloadDialog: {
    title: "Motivo de descarga",
    description:
      "Para el Instituto Humboldt es muy importante saber el uso que se le va a dar a la información obtenida BioTablero.",
    input: {
      label: "¿Cuál es el objetivo de este reporte que estás creando?",
      placeholder: "Estoy creando este reporte para...",
    },
    downloadBtn: {
      title: "Descargar reporte",
      sr: "Descargar reporte",
      label: "Descargar",
    },
    cancelBtn: {
      title: "Cancelar",
      sr: "Cancelar",
      label: "Cancelar",
    },
  },
};
