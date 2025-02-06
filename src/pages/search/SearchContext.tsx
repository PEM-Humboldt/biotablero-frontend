import React from "react";
import { AreaIdBasic, AreaType, Polygon } from "pages/search/types/dashboard";
import { shapeLayer, rasterLayer } from "pages/search/types/layers";
import * as geojson from "geojson";

export type srchType = "definedArea" | "drawPolygon" | null;

export interface SearchContextValues {
  searchType: "definedArea" | "drawPolygon";
  areaType?: AreaType;
  areaId?: AreaIdBasic;
  polygon?: Polygon;
  areaHa?: number;
  setSearchType(searchType: srchType): void;
  setAreaType(areaType?: AreaType): void;
  setAreaId(areaId?: AreaIdBasic): void;
  setPolygon(polygon?: Polygon): void;
  setAreaHa(value?: number): void;
  setAreaLayer(layer: geojson.GeoJsonObject): void;
  //
  setRasterLayers(layers: Array<rasterLayer>): void;
  setShapeLayers(layers: Array<shapeLayer>, showAreaLayer?: boolean): void;
  setLoadingLayer(loading: boolean, error: boolean): void;
  // TODO: Evaluar la necesidad de tenerlo aquí
  setMapTitle(
    name: string,
    gradientData?: { from: number; to: number; colors: Array<string> }
  ): void;
  switchLayer?(layer: string): void;
  handlerClickOnGraph?({}): void;
  cancelActiveRequests?(): void;
}

const SearchContext = React.createContext<SearchContextValues>({
  searchType: "definedArea",
  setSearchType: () => {},
  setAreaType: () => {},
  setAreaId: () => {},
  setPolygon: () => {},
  setAreaHa: () => {},
  setAreaLayer: () => {},
  //
  setRasterLayers: () => {},
  setShapeLayers: () => {},
  setLoadingLayer: () => {},
  setMapTitle: () => {},
  //TODO: "Delete when migration of switch layer is finished" (all 3)
  switchLayer: () => {},
  handlerClickOnGraph: () => {},
  cancelActiveRequests: () => {},
});

export default SearchContext;
