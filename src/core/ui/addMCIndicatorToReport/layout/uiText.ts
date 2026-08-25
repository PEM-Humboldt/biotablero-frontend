export const uiText = {
  addToReportBtn: {
    title: {
      notLogged: "Inicia sesión para crear reportes",
      logged: `Hacer anotacion y agregar a mi reporte`,
    },
    sr: {
      notLogged: "Inicia sesión para crear reportes",
      logged: `Hacer anotacion y agregar a mi reporte`,
    },
    label: (isLoading: boolean) =>
      isLoading ? "Agregando..." : "Agregar a mi reporte",
  },
  editReportBtn: {
    title: "Abrir panel de edicion",
    sr: "Abrir panel para editar y descargar mi reporte",
    label: "Editar",
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
