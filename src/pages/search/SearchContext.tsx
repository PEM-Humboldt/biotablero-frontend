import React from "react";
import type { SearchActions, SearchState } from "./SearchReducer";

export type SrchType = "definedArea" | "drawPolygon" | null;
export type DrawControlHandler = (control: any) => void;

export type SearchContextValues = {
  searchState: SearchState;
  searchDispatch: React.Dispatch<SearchActions>;
};

export const SearchContext = React.createContext({
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
