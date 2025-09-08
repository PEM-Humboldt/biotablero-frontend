import React from "react";
import { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import { ShapeLayer, RasterLayer, MapTitle } from "pages/search/types/layers";
import * as geojson from "geojson";

export type SrchType = "definedArea" | "drawPolygon" | null;
export type DrawControlHandler = (control: any) => void;

export interface SearchContextValues {
  searchType: "definedArea" | "drawPolygon";
  areaType?: AreaType;
  areaId?: AreaIdBasic;
  areaNamesList: AreaIdBasic[];
  areaHa?: number;
  setSearchType(searchType: SrchType): void;
  setAreaType(areaType?: AreaType): void;
  setAreaId(areaId?: AreaIdBasic): void;
  setAreaHa(value?: number): void;
  setAreaLayer(layer?: geojson.GeoJsonObject): void;
  setRasterLayers(layers: Array<RasterLayer>): void;
  setShapeLayers(layers: Array<ShapeLayer>): void;
  setShowAreaLayer(active: boolean): void;
  setLoadingLayer(loading: boolean): void;
  setLayerError(error?: string): void;
  setMapTitle(mapTitle: MapTitle): void;
  clearLayers(): void;
  onEditControlMounted: DrawControlHandler;
  setOnEditControlMounted(handler: Function): void;
}

export const SearchContext = React.createContext<SearchContextValues>({
  searchType: "definedArea",
  areaNamesList: [],
  setSearchType: () => {},
  setAreaType: () => {},
  setAreaId: () => {},
  setAreaHa: () => {},
  setAreaLayer: () => {},
  setRasterLayers: () => {},
  setShapeLayers: () => {},
  setShowAreaLayer: () => {},
  setLoadingLayer: () => {},
  setLayerError: () => {},
  setMapTitle: () => {},
  clearLayers: () => {},
  onEditControlMounted: () => {},
  setOnEditControlMounted: () => {},
});
