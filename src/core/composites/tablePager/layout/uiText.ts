import type { PagerButtons, PagerTexts } from "@composites/TablePager";

export const defaultUI: { buttons: PagerButtons; pagination: PagerTexts } = {
  buttons: {
    prev: { text: "Anterior", icon: "<" },
    next: { text: "siguiente", icon: ">" },
    first: { text: "Primera", icon: "«", enabled: true },
    last: { text: "Última", icon: "»", enabled: true },
  },
  pagination: {
    registryName: "Página",
    registryAmountOf: "de",
    gotoAltText: "ir a",
  },
};
