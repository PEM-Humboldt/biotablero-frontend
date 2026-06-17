import { type ComponentType } from "react";
import {
  ChartBar,
  FileChartColumn,
  type LucideIcon,
  Mountain,
  UsersRound,
} from "lucide-react";
import type { StatsType } from "pages/monitoring/types/stats";
import { GeneralStats } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/GeneralStats";
import { StrategicEcosystemsStats } from "../dataSheetAndNavigation/StrategicEcosystemsStats";

export const tabsAvailable: StatsType[] = [
  "General",
  "Ecosystems",
  "Demographic",
  "Indicators",
];

export const statsTabsInfo: Record<
  StatsType,
  {
    tabBtn: { title?: string; sr?: string; label?: string; icon: LucideIcon };
    titleSr?: string;
    descriptionMD?: string;
    component: ComponentType;
  }
> = {
  General: {
    tabBtn: {
      label: "Cifras generales",
      icon: FileChartColumn,
    },
    component: GeneralStats,
  },
  Ecosystems: {
    tabBtn: {
      label: "Ecosistemas estratégicos",
      icon: Mountain,
    },
    component: StrategicEcosystemsStats,
  },
  Demographic: {
    tabBtn: {
      label: "Datos demográficos",
      icon: UsersRound,
    },
    descriptionMD:
      "Estas cifras muestran la composición de los colaboradores inscritos según su propia designación  ",
  },
  Indicators: {
    tabBtn: {
      label: "Indicadores por escala",
      icon: ChartBar,
    },
    descriptionMD:
      "Estas cifras muestran la distribución de los indicadores calculados según su nivel de [organización de la biodiversidad](https://conbio.onlinelibrary.wiley.com/doi/10.1111/j.1523-1739.1990.tb00309.x). ",
  },
};
