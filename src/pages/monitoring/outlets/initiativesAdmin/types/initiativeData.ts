import type { Dispatch, SetStateAction } from "react";

export type GeneralInfo = {
  name: string;
  shortName: string;
  description: string;
};

export type LocationData = {
  locationId: number;
  locality: string;
};

export type ContactData = {
  phone: string;
  email: string;
};

export type UserData = {
  userName: string;
  level: { id: number; name: string };
};

export type InitiativeDataForm = {
  general: GeneralInfo;
  locations: LocationData[];
  contacts: ContactData[];
  users: UserData[];
};

export type InitiativeToUpadate = {
  id: number;
  name: string;
  shortName: string;
  description: string;
  locations: LocationData[];
  contacts: ContactData[];
  users: UserData[];
};

export type ItemsRenderProps<T> = {
  items: T[];
  editItem: (itemIndex: number) => void;
  deleteItem: (itemIndex: number) => void;
};

export type ItemEditorProps<T> = {
  setter: Dispatch<SetStateAction<T[]>>;
  update: T | null;
};
