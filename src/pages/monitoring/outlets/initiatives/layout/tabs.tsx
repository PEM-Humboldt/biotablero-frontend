import { type ComponentType } from "react";
import {
  ChartBar,
  type LucideIcon,
  MessageSquareText,
  SquareUserRound,
  UsersRound,
} from "lucide-react";
import { Profile } from "pages/monitoring/outlets/initiatives/Profile";
import { Indicators } from "pages/monitoring/outlets/initiatives/Indicators";
import { TerritoryStories } from "pages/monitoring/outlets/initiatives/TerritoryStories";
import { Collaborators } from "pages/monitoring/outlets/initiatives/Collaborators";

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
      component: Indicators,
      slug: "Indicadores",
      icon: ChartBar,
    },
  ],
  [
    "stories",
    {
      label: "Relatos del territorio",
      slug: "Relatos",
      component: TerritoryStories,
      icon: MessageSquareText,
    },
  ],
  [
    "collaborators",
    {
      label: "Colaboradores",
      slug: "Colaboradores",
      component: Collaborators,
      icon: UsersRound,
    },
  ],
]);
