import React from "react";
import { Polygon } from "pages/search/types/drawer";

export interface rasterLayer {
  paneLevel: number;
  id: string;
  data: string;
  opacity?: number;
  selected?: boolean;
}
export interface SearchContextValues {
  areaId: string;
  geofenceId: string | number;
  searchType: "definedArea" | "drawPolygon";
  polygon: Polygon | null;
  rasterLayers: Array<rasterLayer>;
  setRasterLayers(layers: Array<rasterLayer>): void;
  setLoadingLayer(loading: boolean, error: boolean): void;
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
  rasterLayers: [],
  setRasterLayers: () => {},
  setLoadingLayer: () => {},
  //TODO: "Delete when migration of switch layer is finished" (all 3)
  switchLayer: () => {},
  handlerClickOnGraph: () => {},
  cancelActiveRequests: () => {},
});

export default SearchContext;
