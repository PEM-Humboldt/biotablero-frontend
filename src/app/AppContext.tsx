import React from "react";

interface userValues {
  id?: number;
  username: string;
  name?: string;
  company?: {
    id: number;
  };
}

export interface AppContextValue {
  user: userValues | null;
}

// NOTE: Borrar apenas sea actualizado el componente de compoensaciones
export const AppContext = React.createContext<AppContextValue>({
  user: null,
});
