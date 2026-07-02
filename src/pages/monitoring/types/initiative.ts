import type { UserLevel } from "pages/monitoring/types/catalog";
import type {
  LocationCompleteInfo,
  ODataInitiativeShort,
  TagInInitiative,
} from "pages/monitoring/types/odataResponse";
import type { UserInInitiativeCompleteInfo } from "pages/monitoring/types/user";

export type GeneralInfo = {
  name: string;
  shortName?: string;
  description: string;
  objective?: string;
  baseline?: string;
};

export type InitiativeAditionalInfo = {
  creationDate: string;
  coordinate: [number, number];
  polygonArea: number;
  enabled: boolean;
  tags: TagInInitiative[];
};

export type InitiativeByLocation = {
  id: number;
  name: string;
  mainLocationId: number;
  coordinate: [number, number];
  locations?: LocationCompleteInfo[];
  creationDate?: string;
};

export type ImagesData = {
  imageUrl?: File | string | null;
  bannerUrl?: File | string | null;
};

export type TagData = {
  id: number;
  name: string;
};

export type LocationDataBasic = {
  locationId: number;
  locality?: string;
};

export type InitiativeContact = {
  phone?: string;
  email: string;
};

export type UserData = {
  userName: string;
  level: UserLevel;
};

export type WithID<T> = T & { id: number };
export type ContactSRC = WithID<InitiativeContact & { initiativeId: number }>;
export type UserSRC = WithID<
  UserData & { initiativeId: number; creationDate: string }
>;

export type InitiativeCompleteInfo = {
  id: number;
  name: string;
  shortName: string;
  description: string;
  baseline: string;
  objective: string;
  creationDate: string;
  coordinate: [number, number];
  polygonArea: number;
  enabled: boolean;
  users: UserInInitiativeCompleteInfo[];
  bannerUrl?: string;
  imageUrl?: string;
  locations: LocationCompleteInfo[];
  contacts?: ContactSRC[];
  tags: TagInInitiative[];
};

export type InitiativeDisplayInfo = Omit<
  InitiativeCompleteInfo,
  "locations"
> & {
  locations: LocationObj[];
};

export type InitiativeDisplayInfoShort = Omit<
  ODataInitiativeShort,
  "locations"
> & {
  locations: LocationObj[];
};

export type LocationObj = {
  id: number;
  departmentId: number;
  department: string;
  municipalityId: number | null;
  municipality: string | null;
  locality: string | null;
};

export function isTagInInitiative(
  tag: TagData | TagInInitiative,
): tag is TagInInitiative {
  return "initiativeTagId" in tag;
}

export function isLocationObj(location: unknown): location is LocationObj {
  return (
    typeof location === "object" &&
    location !== null &&
    "departmentId" in location &&
    typeof location.departmentId === "number" &&
    "department" in location &&
    typeof location.department === "string" &&
    "municipalityId" in location &&
    (location.municipalityId === null ||
      typeof location.municipalityId === "number") &&
    "municipality" in location &&
    (location.municipality === null ||
      typeof location.municipality === "string") &&
    "locality" in location &&
    (location.locality === null || typeof location.locality === "string")
  );
}
