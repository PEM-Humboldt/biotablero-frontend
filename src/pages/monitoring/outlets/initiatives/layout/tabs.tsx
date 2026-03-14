import { type ComponentType } from "react";
import {
  ChartBar,
  type LucideIcon,
  MessageSquareText,
  SquareUserRound,
  UsersRound,
} from "lucide-react";
import { Profile } from "pages/monitoring/outlets/initiatives/Profile";
import { TerritoryStorys } from "pages/monitoring/outlets/initiatives/TerritoryStorys";

export const initiativeTabs = new Map<
  string,
  { label: string; component: ComponentType; slug: string; icon: LucideIcon }
>([
  [
    "profile",
    {
      label: "Perfil",
      slug: "Perfil",
      component: Profile,
      icon: SquareUserRound,
    },
  ],
  [
    "indicators",
    {
      label: "Indicadores",
      component: () => (
        <h1>Acá van unos indicadores muy goma de la iniciativa</h1>
      ),
      slug: "Indicadores",
      icon: ChartBar,
    },
  ],
  [
    "storys",
    {
      label: "Relatos del territorio",
      slug: "Relatos",
      component: TerritoryStorys,
      icon: MessageSquareText,
    },
  ],
  [
    "collaborators",
    {
      label: "Colaboradores",
      slug: "Colaboradores",
      component: () => (
        <h1>Acá van las fotos nais de la pipol de la iniciativa</h1>
      ),
      icon: UsersRound,
    },
  ],
]);
