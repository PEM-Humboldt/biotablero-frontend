import {
  BadgeCheck,
  BookOpenCheck,
  FilePenLine,
  MessageCircleWarning,
  Network,
} from "lucide-react";
import { type TopicVersionTextType } from "pages/monitoring/types/topics";

export const observationVersionTexts: TopicVersionTextType[] = [
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
