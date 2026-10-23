import {
  BadgeCheck,
  BookOpenCheck,
  FilePenLine,
  MessageCircleWarning,
  Network,
} from "lucide-react";
import { ObservationVersionTextType } from "pages/monitoring/types/observations";

export const observationVersionTexts: ObservationVersionTextType[] = [
  {
    key: "description",
    label: "¿Qué dice este indicador?",
    icon: BadgeCheck,
  },
  {
    key: "methodology",
    label: "Metodología",
    icon: Network,
  },
  {
    key: "interpretation",
    label: "Interpretación",
    icon: BookOpenCheck,
  },
  {
    key: "considerations",
    label: "Consideración",
    icon: MessageCircleWarning,
  },
  {
    key: "authorship",
    label: "Autoría",
    icon: FilePenLine,
  },
];
