import { INITIATIVES_MAP_STATS_GRAPH_COLORS } from "@config/monitoring";

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
  colorPalette: string[] = INITIATIVES_MAP_STATS_GRAPH_COLORS,
): string {
  const index = serieId % (colorPalette.length || 1);
  return colorPalette[index];
}
