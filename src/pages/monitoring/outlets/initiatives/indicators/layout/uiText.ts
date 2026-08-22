import { LOCALE } from "@config/monitoring";
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
    titleBar: {
      tagsTitle: "Etiquetas",
      lastUpdate: (dateString: string) =>
        `Actualizado el ${new Date(dateString).toLocaleDateString(LOCALE)}`,
    },

    tabs: [
      {
        key: "methodology",
        label: "Metodología",
        icon: Network,
      },
      {
        key: "interpretation",
        label: "Interpretación",
        icon: BookOpenCheck,
      },
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
      title: "Selecciona las especies",
      maxSelection: (amount: number) => `selecciona hasta ${amount} especies`,
    },

    detectionProbabilityWCov: {
      selector: {
        itemNotFound: "No se encuentra esa especie",
        trigger: "Selecciona una especie",
        inputPlaceholder: "Escibe el nombre para buscar la especie",
      },
    },

    speciesDiversity: {
      groupSelector: {
        title: "Selecciona un grupo",
        label: "Grupos:",
      },
      indexSelector: {
        title: "Selecciona un índice",
        label: "Índices:",
      },
      leftAxisLegend: "Spp. estimados",
    },

    relativeSpeciesUseByGroup: {
      selector: {
        title: "Selecciona un grupo",
        label: "Grupos:",
      },
    },

    relationalIntensityIndex: {
      averageLabel: "Promedio ponderado",
      selector: {
        title: "Selecciona un periodo",
        label: "Periodos disponibles",
        maxSelection: (amount: number) =>
          `selecciona hasta ${amount} especies rangos`,
      },
      bottomLegend:
        "Linea central= relación neutra · Barra a la derecha= relación colaborativa · Barra a la izquierda= relación conflictiva",
    },

    collectiveActionParticipation: {
      selector: {
        title: "Selecciona una categoría",
        label: "Ver datos por:",
      },
      amountKey: "total",
      amountLabel: (amount: number) => `${amount} Personas`,
    },
  },
};
