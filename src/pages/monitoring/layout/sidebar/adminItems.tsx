import { Logs, Tags, UserRoundCog } from "lucide-react";
import type { DashboardItem } from "pages/monitoring/types/catalog";

export const adminItems: DashboardItem[] = [
  {
    label: "Iniciativas",
    description: "Agrega y actualiza la información de las iniciativas",
    icon: UserRoundCog,
    linkTo: "Admin/Iniciativas",
  },
  {
    label: "Etiquetas",
    description:
      "Crea y administra las etiquetas que son usadas en las iniciativas",
    icon: Tags,
    linkTo: "Admin/Etiquetas",
  },
  {
    label: "Logs",
    description:
      "Consulta y descarga los registros de actividad de la plataforma",
    icon: Logs,
    linkTo: "Admin/Registros",
  },
];
