export const uiText = {
  sidebar: {
    hideFiltersBtnTitle: "Ocultar selector",
    headerText: "Filtros",
    removeFiltersTitle: "Quitar filtros",
    loadingFilters: "Cargando filtros...",
    noFiltersAvailable: "No hay filtros disponibles",
    apliedFilters: "Filtros aplicados",
    removeFiltersLabel: (selectedFilters: number) =>
      `Borrar ${selectedFilters} filtro${selectedFilters > 1 ? "s" : ""}`,
  },

  cards: {
    showFiltersBtnTitle: "Mostrar selector de filtros",
    showFiltersBtnLabel: "Ver filtros",
    loadingIndicatorsCards: "Cargando fichas de indicadores...",
    externalLinkTilte: "Ir al enlace",
    externalLinkSR: "Ir al enlace externo",
    expandCardTitle: "Ampliar",
    collapseCardTitle: "Cerrar",
    expandCardSR: "Ampliar información sobre el indicador",
    collapseCardSR: "Reducir informacion sobre el indicador",
    availableIndicatorsAmount: (indicatorsAmount: number) =>
      indicatorsAmount
        ? `${indicatorsAmount} indicador${indicatorsAmount > 1 ? "es" : ""}`
        : "No hay indicadores disponibles",

    infoDictionary: {
      id: "id",
      title: "Título",
      target: "Objetivo",
      scale: "Escala",
      tags: "Etiquetas",
      lastUpdate: "Última actualización",
      goals: "Metas",
      periodicity: "Periodicidad",
      use: "Contexto de uso",
      description: "Descripción del indicador",
      ebv: "VEBs",
      source: "Fuente",
      requirements: "Requerimientos de información para su cálculo",
      externalLink: "Enlace",
    },
  },
};
