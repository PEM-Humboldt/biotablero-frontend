import type { LatLngBoundsLiteral } from "leaflet";

export const LOCALE = "es-ES";

export const SUPPORT_EMAIL = "biotablero@humboldt.org.co";
export const HORIZONTAL_BREAKPOINT = {
  sm: 640, // tablet vertical
  md: 768, // tablet horizontal
  lg: 1024,
  xl: 1280, // escritorio
  "2xl": 1536,
}; //Breakpoints de pantalla ;

export const BREAKPOINT_PROFILE_BTN_ON_MENU = HORIZONTAL_BREAKPOINT.sm;

export const COUNTRY_BOUNDS: LatLngBoundsLiteral = [
  [-4.2316872, -82.1243666],
  [16.0571269, -66.85119073],
];

export const GRAPH_ANIMATION_CONFIG = {
  duration: 300,
  // NOTE: EaseInOut Cuadratica
  easing: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};
