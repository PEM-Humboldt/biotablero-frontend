import type { UserLevel } from "pages/monitoring/types/monitoring";
import type { Dispatch, SetStateAction } from "react";

// NOTE: Información a suministrar para crear una iniciativa
export type GeneralInfo = {
  name: string;
  shortName?: string;
  description: string;
  objective?: string;
  influenceArea?: string;
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

// NOTE: tipos para los errores
type ErrorFields<T> = { [K in keyof T]?: string[] };
type ErrorsGeneral = ErrorFields<GeneralInfo & { root: string[] }>;

export type InitiativeDataFormErr = {
  general: ErrorsGeneral;
  locations: string[];
  contacts: string[];
  users: string[];
  images: { imageUrl: string[]; bannerUrl: string[] };
};

// NOTE: Data recibida del Servidor
type WithID<T> = T & { id: number };
type LocationDetailSRC = { id: number; name: string; code: string };
type LocationDataSRC = LocationDetailSRC & { parent?: LocationDetailSRC };
type LocationSRC = WithID<LocationData & { location: LocationDataSRC }>;
type ContactSRC = WithID<InitiativeContact & { initiativeId: number }>;
type UserSRC = WithID<
  UserData & { initiativeId: number; creationDate: string }
>;

export type InitiativeToUpadate = WithID<
  GeneralInfo &
    ImagesData & {
      locations: LocationSRC[];
      contacts: ContactSRC[];
      users: UserSRC[];
      creationDate: string;
      coordinate: [number, number];
      polygonArea: number;
      enabled: boolean;
      tags: string[];
    }
>;

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
