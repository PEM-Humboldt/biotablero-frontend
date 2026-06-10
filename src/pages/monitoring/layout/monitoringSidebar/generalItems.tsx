import { useMemo } from "react";
import {
  BadgeQuestionMark,
  BookMarked,
  ChartBar,
  NotepadText,
} from "lucide-react";

import { ColombiaIconLucide } from "@ui/ColombiaIcon";
import { useSidebar } from "@ui/shadCN/component/sidebar";

import type { DashboardItem } from "pages/monitoring/types/catalog";

export function useGeneralItems(): DashboardItem[] {
  const { toggleSidebar, open } = useSidebar();

  const basicItems = useMemo<DashboardItem[]>(
    () => [
      {
        label: "Iniciativas",
        description:
          "Busca y localiza todas las iniciativas de monitoreo que se están realizando",
        icon: ColombiaIconLucide,
        linkTo: "/Monitoreo",
      },
      {
        label: "Indicadores",
        description:
          "Busca y visualiza los indicadore de biodiversidad de todas las iniciativas",
        icon: ChartBar,
        linkTo: "/Monitoreo/Indicadores",
      },
      {
        label: "Recursos",
        description:
          "Busca y comparte guías, herramientas y materiales para el monitoreo",
        icon: BookMarked,
        linkTo: "/Monitoreo/Recursos",
      },
      {
        label: "Glosario",
        description:
          "Consulta el significado de los términos clave usados en la plataforma",
        icon: NotepadText,
        action: toggleSidebar,
        isActive: open,
      },
      {
        label: "Ayudas",
        description:
          "Resuelve las dudas más frecuentes sobre monitoreo y el uso de la plataforma",
        icon: BadgeQuestionMark,
        linkTo: "/Monitoreo/Ayudas",
      },
    ],
    [toggleSidebar, open],
  );

  return basicItems;
}
