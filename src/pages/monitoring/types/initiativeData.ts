import type {
  GeneralInfo,
  LocationDataBasic,
  InitiativeContact,
  UserData,
  ImagesData,
  ContactSRC,
  UserSRC,
  InitiativeAditionalInfo,
  TagData,
} from "pages/monitoring/types/initiative";
import type {
  LocationCompleteInfo,
  TagInInitiative,
} from "pages/monitoring/types/odataResponse";

export type InitiativeDataForm = {
  general: GeneralInfo;
  locations: LocationDataBasic[];
  contacts: InitiativeContact[];
  users: UserData[];
  images: ImagesData;
  tags: (TagData | TagInInitiative)[];
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
  tags: string[];
};

export type CardInfoGrouped = {
  id: number;
  general: GeneralInfo & Omit<InitiativeAditionalInfo, "id" | "tags">;
  locations: LocationCompleteInfo[];
  contacts: ContactSRC[];
  users: UserSRC[];
  images: ImagesData;
  tags: TagInInitiative[];
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
