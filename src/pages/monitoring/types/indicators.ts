import type {
  LocationCompleteInfo,
  TagInIndicator,
} from "pages/monitoring/types/odataResponse";

export type IndicatorVersion = { id: number; version: number };
export type indicatorDescription = { id: number; name: string };

export interface IndicatorMetadata {
  id: number;
  initiativeId: number;
  type: indicatorDescription;
  locations: LocationCompleteInfo[];
  versions: IndicatorVersion[];
  tags: TagInIndicator[];
}
