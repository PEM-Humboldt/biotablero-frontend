import { type GetKeysWithStringValues } from "@appTypes/utils";
import { GoalIcon, MapPinned, SquareUser, type LucideIcon } from "lucide-react";
import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";

export const profileTexts: {
  valueKey: GetKeysWithStringValues<InitiativeCompleteInfo>;
  title: string;
  Icon: LucideIcon;
}[] = [
  {
    valueKey: "description",
    title: "¿Quiénes somos?",
    Icon: SquareUser,
  },
  {
    title: "¿Dónde estamos?",
    valueKey: "baseline",
    Icon: MapPinned,
  },
  {
    title: "¿Cuál es nuestro objetivo?",
    valueKey: "objective",
    Icon: GoalIcon,
  },
];
