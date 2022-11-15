import React from "react";

export interface SearchContextValues {
  areaId: string;
  geofenceId: string | number;
  searchType: "selection" | "polygon";
  switchLayer(layer: string): void;
  handlerClickOnGraph({}): void;
  cancelActiveRequests(): void;
}

const SearchContext = React.createContext<SearchContextValues>({
  areaId: "",
  geofenceId: "",
  searchType: "selection",
  switchLayer: () => {},
  handlerClickOnGraph: () => {},
  cancelActiveRequests: () => {},
});

export default SearchContext;
