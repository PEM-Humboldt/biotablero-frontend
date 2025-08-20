import React from "react";
import { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import { shapeLayer, rasterLayer, MapTitle } from "pages/search/types/layers";
import * as geojson from "geojson";

export type srchType = "definedArea" | "drawPolygon" | null;
export type drawControlHandler = (control: any) => void;

export interface SearchContextValues {
  searchType: "definedArea" | "drawPolygon";
  areaType?: AreaType;
  areaId?: AreaIdBasic;
  areaHa?: number;
  setSearchType: React.Dispatch<React.SetStateAction<srchType>>;
  setAreaType: React.Dispatch<React.SetStateAction<AreaType | undefined>>;
  setAreaId: React.Dispatch<React.SetStateAction<AreaIdBasic | undefined>>;
  setAreaHa: React.Dispatch<React.SetStateAction<number | undefined>>;
  setAreaLayer: (layer?: geojson.GeoJsonObject) => void;
  setRasterLayers: React.Dispatch<React.SetStateAction<Array<rasterLayer>>>;
  setShapeLayers: (layers: Array<shapeLayer>) => void;
  setShowAreaLayer: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingLayer: React.Dispatch<React.SetStateAction<boolean>>;
  setLayerError: React.Dispatch<React.SetStateAction<boolean>>;
  setMapTitle: React.Dispatch<React.SetStateAction<MapTitle>>;
  clearLayers: () => void;
  onEditControlMounted: drawControlHandler;
  setOnEditControlMounted: React.Dispatch<
    React.SetStateAction<drawControlHandler>
  >;
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
  setLayerError: () => {},
  setMapTitle: () => {},
  clearLayers: () => {},
  onEditControlMounted: () => {},
  setOnEditControlMounted: () => {},
});

export default SearchContext;
