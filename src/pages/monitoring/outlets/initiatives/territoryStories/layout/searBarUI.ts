import {
  Calendar1,
  CalendarArrowDown,
  CalendarArrowUp,
  UserRound,
  UsersRound,
} from "lucide-react";

export const orderStateSecuence = ["none", "desc", "asc"] as const;

export const uiElement = {
  none: {
    label: "",
    title: "Del más reciente al más antíguo",
    sr: "Ordenar del relato más reciente al más antíguo",
    icon: Calendar1,
  },
  sort: {
    desc: {
      label: "",
      title: "Del más antíguo al más reciente",
      sr: "Ordenar del relato más antíguo al más reciente",
      icon: CalendarArrowDown,
    },
    asc: {
      label: "",
      title: "Quitar orden",
      sr: "Quitar el orden",
      icon: CalendarArrowUp,
    },
  },
  userFilter: {
    enabled: {
      label: "",
      title: "mostrar los relatos de todos",
      sr: "mostrar los relatos de todos los participantes",
      icon: UserRound,
    },
    disabled: {
      label: "",
      title: "Mostrar solo mis relatos",
      sr: "Mostrar solo mis relatos",
      icon: UsersRound,
    },
  },
};
