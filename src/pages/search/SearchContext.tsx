import React from "react";
import { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import { shapeLayer, rasterLayer, MapTitle } from "pages/search/types/layers";
import * as geojson from "geojson";

export type srchType = "definedArea" | "drawPolygon" | null;

export interface SearchContextValues {
  searchType: "definedArea" | "drawPolygon";
  areaType?: AreaType;
  areaId?: AreaIdBasic;
  areaHa?: number;
  setSearchType(searchType: srchType): void;
  setAreaType(areaType?: AreaType): void;
  setAreaId(areaId?: AreaIdBasic): void;
  setAreaHa(value?: number): void;
  setAreaLayer(layer?: geojson.GeoJsonObject): void;
  setRasterLayers(layers: Array<rasterLayer>): void;
  setShapeLayers(layers: Array<shapeLayer>): void;
  setShowAreaLayer(active: boolean): void;
  setLoadingLayer(loading: boolean, error: boolean): void;
  setMapTitle(mapTitle: MapTitle): void;
}

const SearchContext = React.createContext<SearchContextValues>({
  searchType: "definedArea",
  setSearchType: () => {},
  setAreaType: () => {},
  setAreaId: () => {},
  setAreaHa: () => {},
  setAreaLayer: () => {},
  setRasterLayers: () => {},
  setShapeLayers: () => {},
  setShowAreaLayer: () => {},
  setLoadingLayer: () => {},
  setMapTitle: () => {},
});

export default SearchContext;
