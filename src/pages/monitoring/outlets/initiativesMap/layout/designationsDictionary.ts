import type { DemographicStatsType } from "pages/monitoring/types/stats";

export const designationsDictionary: Record<
  keyof DemographicStatsType,
  { short: string; long: string }
> = {
  gender: {
    short: "Género",
    long: "Identidad de género",
  },
  organization: {
    short: "Organización",
    long: "Organización social",
  },
  selfRecognition: {
    short: "Autoreconocimiento",
    long: "Autoreconocimiento étnico",
  },
};
