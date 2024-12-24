import React from "react";
import { Polygon } from "pages/search/types/drawer";
import { shapeLayer } from "pages/search/types/layers";

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
  shapeLayers: Array<shapeLayer>;
  setRasterLayers(layers: Array<rasterLayer>): void;
  setShapeLayers(layers: Array<shapeLayer>): void;
  setLoadingLayer(loading: boolean, error: boolean): void;
  setPolygonValues(areaValue: number): void;
  switchLayer(layer: string): void;
  setActiveLayer(layer: { id: string; name: string }): void;
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
  shapeLayers: [],
  setRasterLayers: () => {},
  setShapeLayers: () => {},
  setLoadingLayer: () => {},
  //TODO: "Delete when migration of switch layer is finished"
  switchLayer: () => {},
  setActiveLayer: () => {},
  handlerClickOnGraph: () => {},
  cancelActiveRequests: () => {},
});

export default SearchContext;
