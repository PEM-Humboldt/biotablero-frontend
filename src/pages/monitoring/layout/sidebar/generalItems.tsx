import {
  BadgeQuestionMark,
  BookMarked,
  ChartBar,
  FlaskConical,
  House,
  Lightbulb,
  NotepadText,
} from "lucide-react";

import type { DashboardItem } from "pages/monitoring/types/catalog";

export const generalItems: DashboardItem[] = [
  { description: "Iniciativas", icon: House, linkTo: "/Monitoreo" },
  { description: "Indicadores", icon: ChartBar, linkTo: "/Monitoreo" },
  { description: "Recursos", icon: BookMarked, linkTo: "/Monitoreo/Recursos" },
  { description: "Glosario", icon: NotepadText, linkTo: "/Monitoreo" },
  { description: "Preguntas", icon: BadgeQuestionMark, linkTo: "/Monitoreo" },
  { description: "Ayudas", icon: Lightbulb, linkTo: "/Monitoreo" },
  {
    description: "Iniciativas (Provicional)",
    icon: FlaskConical,
    linkTo: "/Monitoreo/Iniciativas",
  },
];
