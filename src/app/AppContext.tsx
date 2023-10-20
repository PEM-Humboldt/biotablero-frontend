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

const AppContext = React.createContext<AppContextValue>({
  user: null,
});

export default AppContext;
