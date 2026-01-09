import type { UserLevel } from "pages/monitoring/types/monitoring";
import type {
  LocationCompleteInfo,
  ODataInitiativeShortEntry,
} from "pages/monitoring/types/requestParams";
import type { Dispatch, SetStateAction } from "react";

// NOTE: Información a suministrar para crear una iniciativa
export type GeneralInfo = {
  name: string;
  shortName?: string;
  description: string;
  objective?: string;
  influenceArea?: string;
};

type InitiativeAditionalInfo = {
  creationDate: string;
  coordinate: [number, number];
  polygonArea: number;
  enabled: boolean;
  tags: string[];
};

export type ImagesData = {
  imageUrl?: File | string | null;
  bannerUrl?: File | string | null;
};

export type LocationData = {
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

export type InitiativeDataForm = {
  general: GeneralInfo;
  locations: LocationData[];
  contacts: InitiativeContact[];
  users: UserData[];
  images: ImagesData;
};

export type InitiativeDataFormFormatted = Omit<
  InitiativeDataForm,
  "locations"
> & {
  locations: LocationObj[];
};

// NOTE: tipos para los errores
export type ErrorFields<T> = { [K in keyof T]?: string[] };
type ErrorsGeneral = ErrorFields<GeneralInfo & { root: string[] }>;
type ErrorsImages = ErrorFields<ImagesData & { root: string[] }>;

export type InitiativeDataFormErr = {
  root: string[];
  general: ErrorsGeneral;
  locations: string[];
  contacts: string[];
  users: string[];
  images: ErrorsImages;
};

// NOTE: Data recibida del Servidor
type WithID<T> = T & { id: number };
type LocationSRC = LocationCompleteInfo;
type ContactSRC = WithID<InitiativeContact & { initiativeId: number }>;
type UserSRC = WithID<
  UserData & { initiativeId: number; creationDate: string }
>;

export type InitiativeFullInfo = WithID<
  GeneralInfo &
    ImagesData &
    InitiativeAditionalInfo & {
      locations: LocationSRC[];
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

export function isInitiativeDisplayInfo(
  e: unknown,
): e is InitiativeDisplayInfo {
  return (
    typeof e === "object" &&
    e !== null &&
    "name" in e &&
    (!("shortName" in e) || typeof e["shortName"] === "string") &&
    "description" in e &&
    (!("objective" in e) || typeof e["objective"] === "string") &&
    (!("influenceArea" in e) || typeof e["influenceArea"] === "string") &&
    typeof e["description"] === "string" &&
    "creationDate" in e &&
    typeof e["creationDate"] === "string" &&
    "coordinate" in e &&
    Array.isArray(e["coordinate"]) &&
    "polygonArea" in e &&
    typeof e["polygonArea"] === "number" &&
    "enabled" in e &&
    typeof e["enabled"] === "boolean" &&
    "locations" in e &&
    "contacts" in e &&
    "users" in e
  );
}

// NOTE: Interfaz de los componentes del formulario
export type ItemsRenderProps<T> = {
  selectedItems: T[];
  editItem: (itemIndex: number) => void;
  deleteItem: (itemIndex: number) => void;
};

export type ItemEditorProps<T> = {
  selectedItems?: T[];
  setter: Dispatch<SetStateAction<T[]>>;
  update: T | null;
};

// NOTE: Objetos para facilitar la manipulacion de la información
export type LocationObj = {
  department: string;
  municipality: string | null;
  locality: string | null;
};
