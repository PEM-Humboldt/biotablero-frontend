import React from "react";

export interface AppContextValue {
  user: null;
}

const AppContext = React.createContext<AppContextValue>({
  user: null,
});

export default AppContext;
