export interface UserType {
  id: number;
  name: string;
  username: string;
  company?: {
    id: number;
  };
}

// WARN: CONFLICTO CON ESTE TIPO QUE VIENE DEL CONTEXTO VIEJO
interface userValues {
  id?: number;
  username: string;
  name?: string;
  company?: {
    id: number;
  };
}

export interface LoginUimProps {
  currentUser: UserType | null;
  setUser: (res: UserType | null) => void;
  logoutUser: () => void;
}
