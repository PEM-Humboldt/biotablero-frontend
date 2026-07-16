// import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";

import {
  Network,
  BookOpenCheck,
  MessageCircleWarning,
  FilePenLine,
} from "lucide-react";

export const uiText = {
  search: {
    module: {
      title: "Buscar indicadores",
      searchInputLabel: "Nombre del indicador",
      filterBiological: {
        label: "Escala Biológica",
        placeholder: "Selecciona una escala",
      },
      filterEcosystem: {
        label: "Ecosistemas estratégicos",
        placeholder: "¿Qué ecosistema buscas?",
      },
      filterYear: {
        label: "Año",
        placeholder: "¿De qué añó es el indicador?",
      },
      resetSearchBtn: {
        sr: "Reiniciar búsqueda",
        title: "Limpiar filtros",
        label: "Limpiar filtros",
      },
    },
    card: {
      singleVersion: { title: "Publicado" },
      nVersions: {
        title: "Versiones",
        first: "Primera publicación",
        last: "Última actialización",
      },
      gotoBtn: {
        sr: undefined,
        title: "Ver indicador",
        label: "Ver indicador",
      },
      descriptionTitle: "¿Qué dice este indicador?",
    },
  },

  indicatorCard: {
    noSelection: "Selecciona un indicador",
    noIndicators: "Esta iniciativa todavía no tiene indicadores asociados",

    tabs: [
      { key: "methodology", label: "Metodología", icon: Network },
      { key: "interpretation", label: "Interpretación", icon: BookOpenCheck },
      {
        key: "considerations",
        label: "Consideración",
        icon: MessageCircleWarning,
      },
      { key: "authorship", label: "Autoría", icon: FilePenLine },
    ],

    rangedTooltip: {
      upperLimitTitle: "Límite superior",
      valueTitle: "Índice",
      lowerLimitTitle: "Límite inferior",
    },

    ocupationSpecies: {
      maxSelection: (amount: number) => `selecciona hasta ${amount} especies`,
    },

    detectionProbabilityWCov: {
      selector: {
        itemNotFound: "No se encuentra esa especie",
        trigger: "Selecciona una especie",
        inputPlaceholder: "Escibe el nombre para buscar la especie",
      },
    },
  },
};
