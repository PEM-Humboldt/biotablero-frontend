import type { PagerButtons, PagerTexts } from "@composites/TablePager";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export const defaultUI: { buttons: PagerButtons; pagination: PagerTexts } = {
  buttons: {
    prev: { text: "Anterior", icon: <ChevronLeft aria-hidden="true" /> },
    next: { text: "siguiente", icon: <ChevronRight aria-hidden="true" /> },
    first: {
      text: "Primera",
      icon: <ChevronsLeft aria-hidden="true" />,
      enabled: true,
    },
    last: {
      text: "Última",
      icon: <ChevronsRight aria-hidden="true" />,
      enabled: true,
    },
  },
  pagination: {
    registryName: "Página",
    registryAmountOf: "de",
    gotoAltText: "ir a",
  },
};
