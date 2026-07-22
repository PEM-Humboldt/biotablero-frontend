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
} from "lucide-react";

import { ColombiaIconLucide } from "@ui/ColombiaIcon";
import { useSidebar } from "@ui/shadCN/component/sidebar";

import {
  RoleInMonitoring,
  type SidebarItem,
} from "pages/monitoring/types/catalog";
import { useUserCTX } from "@hooks/UserCTX";

export function useSidebarItems() {
  const { user } = useUserCTX();
  const { toggleSidebar, open } = useSidebar();

  const groupsInfo = useMemo(
    () => ({
      1: { label: "", sr: "" },
      2: { label: "", sr: "Administrar tu cuenta" },
      3: { label: "Administrar", sr: "Administrar el módulo" },
    }),
    [],
  );

  const itemsList = useMemo<SidebarItem[]>(
    () =>
      [
        // NOTE: items para cualquier usuario
        {
          label: "Iniciativas",
          description:
            "Busca y localiza todas las iniciativas de monitoreo que se están realizando",
          icon: ColombiaIconLucide,
          linkTo: "/Monitoreo",
          role: RoleInMonitoring.NONE,
          group: 1,
        },
        {
          label: "Indicadores",
          description:
            "Busca y visualiza los indicadores de biodiversidad de todas las iniciativas",
          icon: ChartBar,
          linkTo: "/Monitoreo/Indicadores",
          role: RoleInMonitoring.NONE,
          group: 1,
        },
        {
          label: "Recursos",
          description:
            "Busca y comparte guías, herramientas y materiales para el monitoreo",
          icon: BookMarked,
          linkTo: "/Monitoreo/Recursos",
          role: RoleInMonitoring.NONE,
          group: 1,
        },
        {
          label: "Ayudas",
          description:
            "Resuelve las dudas más frecuentes sobre monitoreo y el uso de la plataforma",
          icon: BadgeQuestionMark,
          linkTo: "/Monitoreo/Ayudas",
          role: RoleInMonitoring.NONE,
          group: 1,
        },
        {
          label: "Glosario",
          description:
            "Consulta el significado de los términos clave usados en la plataforma",
          icon: NotepadText,
          action: toggleSidebar,
          isActive: open,
          role: RoleInMonitoring.NONE,
          group: 1,
        },

        // NOTE: items para usuarios registrados en biotablero
        {
          label: "Mi Perfil",
          description:
            "Gestiona tu perfil y las iniciativas en las que participas",
          icon: UserRoundCheck,
          linkTo: "MiPerfil",
          role: RoleInMonitoring.USER,
          group: 2,
        },

        // NOTE: items para administradores de biotablero
        {
          label: "Iniciativas",
          description: "Agrega y actualiza la información de las iniciativas",
          icon: UserRoundCog,
          linkTo: "Admin/Iniciativas",
          role: RoleInMonitoring.ADMIN,
          group: 3,
        },
        {
          label: "Etiquetas",
          description:
            "Crea y administra las etiquetas que son usadas en las iniciativas",
          icon: Tags,
          linkTo: "Admin/Etiquetas",
          role: RoleInMonitoring.ADMIN,
          group: 3,
        },
        {
          label: "Logs",
          description:
            "Consulta y descarga los registros de actividad de la plataforma",
          icon: Logs,
          linkTo: "Admin/Registros",
          role: RoleInMonitoring.ADMIN,
          group: 3,
        },
      ].filter(
        (i) =>
          i.role === RoleInMonitoring.NONE ||
          (user && user.roles.includes(i.role)),
      ),
    [toggleSidebar, open, user],
  );

  const items = useMemo(() => {
    return itemsList.reduce<
      Record<number, { label: string; sr: string; items: SidebarItem[] }>
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

  return items;
}
