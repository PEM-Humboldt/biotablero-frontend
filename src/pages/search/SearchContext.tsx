import React from "react";
import { Polygon } from "pages/search/types/drawer";

export interface SearchContextValues {
  areaId: string;
  geofenceId: string | number;
  searchType: "definedArea" | "drawPolygon";
  polygon: Polygon | null;
  setPolygonValues(areaValue: number): void;
  switchLayer(layer: string): void;
  handlerClickOnGraph({}): void;
  cancelActiveRequests(): void;
}

const SearchContext = React.createContext<SearchContextValues>({
  areaId: "",
  geofenceId: "",
  searchType: "definedArea",
  polygon: null,
  setPolygonValues: () => {},
  switchLayer: () => {},
  handlerClickOnGraph: () => {},
  cancelActiveRequests: () => {},
});

export default SearchContext;
