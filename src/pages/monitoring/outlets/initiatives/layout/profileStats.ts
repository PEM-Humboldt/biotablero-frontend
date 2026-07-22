import {
  ChartBar,
  GroupIcon,
  type LucideIcon,
  VectorSquare,
} from "lucide-react";
import type { InitiativeStatsComplete } from "pages/monitoring/types/stats";

export const profileStats: {
  valueKey: keyof InitiativeStatsComplete;
  icon: LucideIcon;
  title: string;
  hoverTitle?: string;
  unit?: string;
}[] = [
  {
    valueKey: "area",
    icon: VectorSquare,
    title: "Área bajo monitoreo comunitario",
    hoverTitle: undefined,
    unit: "ha",
  },
  {
    valueKey: "totalMunicipalities",
    icon: GroupIcon,
    title: "Número de municipios monitoreados",
    hoverTitle: undefined,
    unit: undefined,
  },
  {
    valueKey: "totalIndicators",
    icon: ChartBar,
    title: "Número total de indicadores",
    hoverTitle: undefined,
    unit: undefined,
  },
];
