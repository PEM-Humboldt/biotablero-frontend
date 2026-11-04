import { useMemo } from "react";
import {
  BadgeQuestionMark,
  BookMarked,
  ChartBar,
  NotepadText,
  Logs,
  Tags,
  UserRoundCog,
  UserRoundCheck,
  ScanEye,
} from "lucide-react";

import { ColombiaIconLucide } from "@ui/ColombiaIcon";
import { useSidebar } from "@ui/shadCN/component/sidebar";

import {
  RoleInMonitoring,
  type SidebarItem,
} from "pages/monitoring/types/catalog";
import { useUserCTX } from "@hooks/UserCTX";

const groupsInfo = {
  common: { label: "", sr: "" },
  user: { label: "", sr: "Administrar tu cuenta" },
  admin: { label: "Administrar", sr: "Administrar el módulo" },
};

export function useSidebarItems() {
  const { user } = useUserCTX();
  const { toggleSidebar, open } = useSidebar();

  const initiativeSubPathsExclusion = [
    "Indicadores",
    "Recursos",
    "Ayudas",
    "MiPerfil",
    "Admin",
  ];

  const itemsList = useMemo<SidebarItem[]>(
    () => [
      // NOTE: items para cualquier usuario
      {
        label: "Iniciativas",
        description:
          "Busca y localiza todas las iniciativas de monitoreo que se están realizando",
        icon: ColombiaIconLucide,
        linkTo: "/Monitoreo",
        group: "common",
      },
      {
        label: "Indicadores",
        description:
          "Busca y visualiza los indicadores de biodiversidad de todas las iniciativas",
        icon: ChartBar,
        linkTo: "/Monitoreo/Indicadores",
        group: "common",
      },
      {
        label: "Recursos",
        description:
          "Busca y comparte guías, herramientas y materiales para el monitoreo",
        icon: BookMarked,
        linkTo: "/Monitoreo/Recursos",
        group: "common",
      },
      {
        label: "Ayudas",
        description:
          "Resuelve las dudas más frecuentes sobre monitoreo y el uso de la plataforma",
        icon: BadgeQuestionMark,
        linkTo: "/Monitoreo/Ayudas",
        group: "common",
      },
      {
        label: "Glosario",
        description:
          "Consulta el significado de los términos clave usados en la plataforma",
        icon: NotepadText,
        action: toggleSidebar,
        isActive: open,
        group: "common",
      },

      // NOTE: items para usuarios registrados en biotablero
      ...(user && !user.roles.includes(RoleInMonitoring.ADMIN)
        ? ([
            {
              label: "Mi Perfil",
              description:
                "Gestiona tu perfil y las iniciativas en las que participas",
              icon: UserRoundCheck,
              linkTo: "/Monitoreo/MiPerfil",
              group: "user",
            },
          ] satisfies SidebarItem[])
        : []),

      // NOTE: items para administradores de biotablero
      ...(user && user.roles.includes(RoleInMonitoring.ADMIN)
        ? ([
            {
              label: "Iniciativas",
              description:
                "Agrega y actualiza la información de las iniciativas",
              icon: UserRoundCog,
              linkTo: "Admin/Iniciativas",
              group: "admin",
            },
            {
              label: "Temáticas",
              description:
                "Carga y actualiza las observaciones realizadas por las Iniciativas",
              icon: ScanEye,
              linkTo: "Admin/Tematicas",
              group: "admin",
            },
            {
              label: "Etiquetas",
              description:
                "Crea y administra las etiquetas que son usadas en las iniciativas",
              icon: Tags,
              linkTo: "Admin/Etiquetas",
              group: "admin",
            },
            {
              label: "Logs",
              description:
                "Consulta y descarga los registros de actividad de la plataforma",
              icon: Logs,
              linkTo: "Admin/Registros",
              group: "admin",
            },
          ] satisfies SidebarItem[])
        : []),
    ],
    [toggleSidebar, open, user],
  );

  const items = useMemo(() => {
    return itemsList.reduce<
      Partial<
        Record<
          SidebarItem["group"],
          { label: string; sr: string; items: SidebarItem[] }
        >
      >
    >((all, current) => {
      const groupKey = current.group;

      if (!all[groupKey]) {
        all[groupKey] = {
          ...groupsInfo[groupKey as keyof typeof groupsInfo],
          items: [],
        };
      }

      all[groupKey].items.push(current);

      return all;
    }, {});
  }, [itemsList, groupsInfo]);

  return { items, initiativeSubPathsExclusion };
}
