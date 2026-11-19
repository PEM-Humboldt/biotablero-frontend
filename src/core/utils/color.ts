import { GRAPHS_EXTENDED_COLOR_PALETTE } from "@config/color";

/**
 * Lighten or darken color base on percent sign. Taken from https://gist.github.com/renancouto/4675192
 * @param {String} color Hex color
 * @param {Number} percent percentage value
 */
const changeColor = (color: string, percent: number): string => {
  const num: number = parseInt(color.replace("#", ""), 16);
  const amt: number = Math.round(2.55 * percent);
  const R: number = (num >> 16) + amt;
  const B: number = ((num >> 8) & 0x00ff) + amt;
  const G: number = (num & 0x0000ff) + amt;

  const newR: number = R < 1 ? 0 : R;
  const newB: number = B < 1 ? 0 : B;
  const newG: number = G < 1 ? 0 : G;

  return `#${(
    0x1000000 +
    (R < 255 ? newR : 255) * 0x10000 +
    (B < 255 ? newB : 255) * 0x100 +
    (G < 255 ? newG : 255)
  )
    .toString(16)
    .slice(1)}`;
};

export const lightenColor = (color: string, percent: number): string =>
  changeColor(color, percent);
export const darkenColor = (color: string, percent: number): string =>
  changeColor(color, percent * -1);

/**
 * Calculates and returns a color from a provided palette based on a unique series identifier, and ensures that the same ID will always resolve to the same color.
 *
 * @param serieId - The unique numeric identifier
 * @param colorPalette - An array of hexadecimal color strings. Defaults to `INITIATIVES_MAP_STATS_GRAPH_COLORS`.
 *
 * @returns The color string corresponding to the resolved index within the palette.
 */
export function getSeriesColor(
  serieId: number,
  colorPalette: string[] = GRAPHS_EXTENDED_COLOR_PALETTE,
): string {
  const index = serieId % (colorPalette.length || 1);
  return colorPalette[index];
}

/**
 * Calculates the perceived brightness of a hex color using the YIQ formula to return either black or white for optimal foreground text contrast.
 *
 * @param hexColor - The background color in hexadecimal format
 *
 * @returns `#000000` for light background colors, or `#ffffff` for dark background colors.
 */
export function getContrastColor(hexColor: string): string {
  const cleanHex = hexColor.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const percievedIlluminationIndex = (r * 299 + g * 587 + b * 114) / 1000;

  return percievedIlluminationIndex >= 128 ? "#000000" : "#ffffff";
}
