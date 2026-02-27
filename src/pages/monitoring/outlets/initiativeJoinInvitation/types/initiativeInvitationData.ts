// NOTE: Información a suministrar para crear una invitación a unirse a una iniciativa

export type JoinInitiativeGuest = {
  email: string;
};

export type JoinInitiativeDataForm = {
  initiativeId: number;
  message?: string;
  guests: JoinInitiativeGuest[];
};

// NOTE: tipos para los errores
export type ErrorFields<T> = { [K in keyof T]?: string[] };

export type JoinInitiativeDataFormErr = {
  root: string[];
  initiativeId: string[];
  message: string[];
  guests: string[];
};