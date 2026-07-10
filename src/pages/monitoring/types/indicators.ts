import type {
  LocationCompleteInfo,
  TagInIndicator,
} from "pages/monitoring/types/odataResponse";

export type indicatorDescription = { id: number; name: string };
export type IndicatorVersion = {
  id: number;
  creationDate: string;
  version: number;
};

export interface IndicatorMetadata {
  id: number;
  name: string;
  initiativeId: number;
  type: indicatorDescription;
  locations: LocationCompleteInfo[];
  versions: IndicatorVersion[];
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
type IndicatorValue = {
  id: number;
  date: { year: number; month: number };
  dateEnd?: { year: number; month: number };
  value: number;
  upperLimit?: number;
  lowerLimit?: number;
  measureUnit: { name: string; representation?: string };
};

/* NOTE:
 * Opcionales-> Group
 *  description?: string
 *  Los necesita 1, 2, 4
 * -
 *  parent?: {id: number, name: string}
 *  los necesita 1,2,4,5,6
 */
type IndicatorGroup = {
  id: number;
  category: {
    id: number;
    name: string;
    description?: string;
    parent?: { id: number; name: string };
  };
  values: IndicatorValue[];
};

export interface IndicatorData {
  id: number;
  indicatorId: number;
  creationDate: string;
  version: number;
  description: string;
  methodology: string;
  interpretation: string;
  considerations: string;
  authorship: string;
  groups: IndicatorGroup[];
}
