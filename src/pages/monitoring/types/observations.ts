import type {
  LocationCompleteInfo,
  TagInIndicator,
} from "pages/monitoring/types/odataResponse";

export enum ObservationMetric {
  OCCUPATION_SPECIES = 1,
  DETECTION_PROBABILITY_WITHOUT_COVARIABLES = 2,
  SPECIES_DIVERSITY = 3,
  RELATIVE_SPECIES_USE_BY_GROUP = 4,
  RELATIONAL_INTENSITY_INDEX = 5,
  COLLECTIVE_ACTION_PARTICIPATION = 6,
}

export type ObservationDescription = { id: ObservationMetric; name: string };
export type ObservationVersion = {
  id: number;
  creationDate: string;
  version: number;
};

export interface ObservationMetadata {
  id: number;
  name: string;
  initiativeId: number;
  initiativeName?: string;
  topic: ObservationDescription;
  locations: LocationCompleteInfo[];
  versions: ObservationVersion[];
  tags: TagInIndicator[];
}

/* NOTE:
 * Opcionales-> Value
 *	dateEnd?: {year: number, month: number}
 *	solo lo necesita el 4
 * -
 *  upperLimit?: number
 *  lowerLimit?: number
 *  Se necesitan en conjunto
 *  los necesita el 2, 3
 * -
 *  measureUnit: {name: string, representation?: string}
 *  no lo necesitan 11 y 12
 */
type ObservationValue = {
  id: number;
  date: { year: number; month: number };
  dateEnd?: { year: number; month: number };
  value: number;
  upperLimit?: number;
  lowerLimit?: number;
  indicatorType: { name: string; representation?: string };
};

/* NOTE:
 * Opcionales-> Group
 *  description?: string
 *  Los necesita 1, 2, 4
 * -
 *  parent?: {id: number, name: string}
 *  los necesita 1,2,4,5,6
 */
export type ObservationGroup = {
  id: number;
  category: {
    id: number;
    name: string;
    description?: string;
    parent?: { id: number; name: string };
  };
  values: ObservationValue[];
};

export interface ObservationData {
  id: number;
  observationId: number;
  creationDate: string;
  version: number;
  description?: string;
  methodology?: string;
  interpretation?: string;
  considerations?: string;
  authorship?: string;
  groups: ObservationGroup[];
}

export type LineDataValues = {
  x: string;
  y: number;
  upperLimit?: number;
  lowerLimit?: number;
  hasLimits: boolean;
  sortKey: number;
};

export type LineData = {
  id: string;
  scientificName: string;
  commonName: string;
  metricName: string;
  data: LineDataValues[];
};

export type BarDataValues = {
  name: string;
  commonName: string;
  value: number;
  date: string;
  parent: string;
  sortKey: number;
};

export type BarDataKeys = {
  date: Set<string>;
  name: Set<string>;
  parent: Set<string>;
  dateSorter: Map<number, string>;
};

export type BarsData = {
  keys: Partial<BarDataKeys>;
  values: BarDataValues[];
};

export type CleanDataType = {
  cleanData: BarsData | LineData[];
};
