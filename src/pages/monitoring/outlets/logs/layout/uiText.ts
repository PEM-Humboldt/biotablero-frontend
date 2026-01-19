export const uiText = {
  logsTitle: "Registros del sistema",
  noLogsAvailable: "No hay registros disponibles",

  logLoadingStates: {
    loaded: null,
    loading: "Cargando registros...",
    error: "No fue posible cargar los registros, intenta más tarde.",
  },

  download: {
    button: {
      isReady: "Descargar resultados",
      isDownloading: "Generando xlsx...",
    },
    warn: "No puede generar reportes con más de 10.000 registros. Modifique los filtros para reducir los resultados y habilitar la descarga.",
  },

  searchBar: {
    submitBtn: "", // NOTE: Leave empty to search while typing
    resetBtn: "Borrar filtros", // NOTE: leave empty to hide
  },

  table: {
    detailsBtn: {
      defaultText: "Detalles",
      loadStatus: {
        loaded: null,
        loading: "Cargando...",
        error: "Registro no disponible, intenta de nuevo más tarde",
      },
    },
  },

  pager: {
    buttons: {
      prev: { text: "Anterior", icon: "<" },
      next: { text: "siguiente", icon: ">" },
      first: { text: "Primera", icon: "«" },
      last: { text: "Última", icon: "»" },
    },
    texts: {
      registryPageName: "Página",
      registryPageOf: "de",
      gotoAltText: "ir a",
    },
  },
};
