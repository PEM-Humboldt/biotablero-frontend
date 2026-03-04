import {
  BadgeQuestionMark,
  FilePlay,
  House,
  PackageOpen,
  ZoomIn,
} from "lucide-react";

import type { DashboardItem } from "pages/monitoring/types/catalog";

export const generalItems: DashboardItem[] = [
  { description: "Mapa de iniciativas", icon: House, linkTo: "/Monitoreo" },
  { description: "Buscar indicadores", icon: ZoomIn, linkTo: "/" },
  { description: "Recursos", icon: PackageOpen, linkTo: "/" },
  { description: "Tutorial", icon: FilePlay, linkTo: "/" },
  { description: "Preguntas Frecuentes", icon: BadgeQuestionMark, linkTo: "/" },
];
