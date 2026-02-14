import type { UserLevel } from "pages/monitoring/types/catalog";
import type {
  LocationCompleteInfo,
  ODataInitiativeShortEntry,
} from "pages/monitoring/types/odataResponse";

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

export type InitiativeDataForm = {
  general: GeneralInfo;
  locations: LocationDataBasic[];
  contacts: InitiativeContact[];
  users: UserData[];
  images: ImagesData;
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
export type WithID<T> = T & { id: number };
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

export type CardInfoGrouped = {
  id: number;
  general: GeneralInfo & Omit<InitiativeAditionalInfo, "id">;
  locations: LocationSRC[];
  contacts: ContactSRC[];
  users: UserSRC[];
  images: ImagesData;
};

// NOTE: Interfaz de los componentes del formulario
export type ItemsRenderProps<T> = {
  selectedItems: T[];
  editItem: (itemIndex: number) => void;
  deleteItem: (itemIndex: number) => void;
};

export type TableRenderProps<T, R extends object> = {
  title: string;
  items: T[];
  rowInfoCallback?: (item: T) => Promise<R | null>;
  editItem?: (itemId: number) => void;
  deleteItem: (itemId: number) => void;
  render: Map<string, keyof R>;
  edit: boolean;
  className?: string;
  disabled: boolean;
};

export type ItemEditorProps<T> = {
  selectedItems?: T[];
  setter: (value: T) => void;
  update: T | null;
  discard?: () => void;
  disabled?: boolean;
};

// NOTE: Objetos para facilitar la manipulacion de la información
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
