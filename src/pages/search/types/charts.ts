export type wrapperMessage = "loading" | "no-data" | "custom" | null;

export interface SmallBarTooltip {
  group: string;
  category: string;
  tooltipContent: Array<string>;
}
