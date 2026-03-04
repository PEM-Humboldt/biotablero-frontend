// NOTE: Información a suministrar para crear una etiqueta

export type TagCategory = {
  id: number;
  name: string;
};

export type TagDataForm = {
  name: string;
  url?: string;
  category: TagCategory;
};

// NOTE: tipos para los errores
export type ErrorFields<T> = { [K in keyof T]?: string[] };

export type TagDataFormErr = {
  root: string[];
  name: string[];
  url: string[];
  category: string[];
};
