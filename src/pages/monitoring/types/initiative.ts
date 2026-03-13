import type { UserLevel } from "pages/monitoring/types/catalog";
import type {
  LocationCompleteInfo,
  ODataInitiativeShortEntry,
} from "pages/monitoring/types/odataResponse";

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
  tags: InitiativeTag[];
};

export type ImagesData = {
  imageUrl?: File | string | null;
  bannerUrl?: File | string | null;
};

export type LocationDataBasic = {
  locationId: number;
  locality?: string;
};

export type InitiativeContact = {
  phone?: string;
  email: string;
};

export type InitiativeTag = {
  initiativeTagId: number;
  tag: {
    category: {
      id: number;
      name: string;
    }
  }
};

export type TagDataBasic = {
  category: string;
  name: string;
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

export type InitiativeFullInfo = WithID<
  GeneralInfo &
    ImagesData &
    InitiativeAditionalInfo & {
      locations: LocationCompleteInfo[];
      contacts: ContactSRC[];
      users: UserSRC[];
    }
>;

export type InitiativeDisplayInfo = Omit<InitiativeFullInfo, "locations"> & {
  locations: LocationObj[];
};

export type InitiativeDisplayInfoShort = Omit<
  ODataInitiativeShortEntry,
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
