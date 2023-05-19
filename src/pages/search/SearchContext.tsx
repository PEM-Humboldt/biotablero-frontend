import React from "react";
import { Polygon } from "pages/search/types/drawer";

export interface SearchContextValues {
  areaId: string;
  geofenceId: string | number;
  searchType: "definedArea" | "drawPolygon";
  polygon: Polygon | null;
  polygonFolder: string;
  polygonArea: number;
  setPolygonArea(value: number): void;
  setLoadingLayer(value: boolean): void;
  switchLayer(layer: string): void;
  handlerClickOnGraph({}): void;
  cancelActiveRequests(): void;
}

const SearchContext = React.createContext<SearchContextValues>({
  areaId: "",
  geofenceId: "",
  searchType: "definedArea",
  polygon: null,
  polygonFolder: "",
  polygonArea: 0,
  setPolygonArea: () => {},
  setLoadingLayer: () => {},
  switchLayer: () => {},
  handlerClickOnGraph: () => {},
  cancelActiveRequests: () => {},
});

export default SearchContext;
