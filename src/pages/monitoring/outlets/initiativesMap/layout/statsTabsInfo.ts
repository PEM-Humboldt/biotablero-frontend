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
import { StrategicEcosystemsStats } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/StrategicEcosystemsStats";
import { DemographicsStats } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/DemographicsStats";
import { IndicatorsStats } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/IndicatorsStats";

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
    component: DemographicsStats,
  },
  Indicators: {
    tabBtn: {
      label: "Indicadores por escala",
      icon: ChartBar,
    },
    component: IndicatorsStats,
  },
};
