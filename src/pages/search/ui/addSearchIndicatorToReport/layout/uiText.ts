export const uiText = {
  addToReportBtn: {
    title: {
      notLogged: "Inicia sesión para crear reportes",
      logged: `Hacer anotacion y sumar al reporte`,
    },
    sr: {
      notLogged: "Inicia sesión para crear reportes",
      logged: `Hacer anotacion y sumar al reporte`,
    },
    label: {
      loading: "Agregando...",
      ready: "Sumar al reporte",
    },
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
};
