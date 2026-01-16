import {
  useContext,
  createContext,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type MutableRefObject,
} from "react";

import {
  SearchUpdated,
  type SearchActions,
  type SearchState,
} from "pages/search/hooks/SearchReducer";
import type {
  MapTitle,
  RasterLayer,
  ShapeLayer,
} from "pages/search/types/layers";
import type { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import type * as geojson from "geojson";
import type L from "leaflet";

export type SrchType = "definedArea" | "drawPolygon" | null;
export type DrawControlHandler = (control: unknown) => void;
export type DrawControlType = {
  drawControlsRef: MutableRefObject<L.Control.Draw | null>;
  areDrawControlsMounted: boolean;
  setAreDrawControlMounted: (mounted: boolean) => void;
};

const SearchStateCTX = createContext<SearchState | null>(null);
const SearchDispatchCTX = createContext<Dispatch<SearchActions> | null>(null);
const SearchDrawControlsCTX = createContext<DrawControlType | null>(null);
export const SearchLegacyCTX = createContext<LegacyContextValues | null>(null);

export function useSearchStateCTX() {
  const context = useContext(SearchStateCTX);
  if (!context) {
    throw new Error("useSearchStateCTX must be within the SearchStateCTX");
  }
  return context;
}

export function useSearchDispatchCTX() {
  const dispatch = useContext(SearchDispatchCTX);
  if (!dispatch) {
    throw new Error(
      "useSearchDispatchCTX must be within the SearchDispatchCTX",
    );
  }
  return dispatch;
}

export function useSearchDrawControlsCTX() {
  const drawControls = useContext(SearchDrawControlsCTX);
  if (!drawControls) {
    throw new Error(
      "useSearchDrawControlsCTX must be within the SearchDrawControlsCTX",
    );
  }
  return drawControls;
}

export function SearchCTX({
  state,
  dispatch,
  children,
}: {
  state: SearchState;
  dispatch: React.Dispatch<SearchActions>;
  children: React.ReactNode;
}) {
  const drawControlsRef = useRef(null);
  const [areDrawControlsMounted, setAreDrawControlMounted] = useState(false);
  const searchDrawCTXvalues = {
    drawControlsRef,
    areDrawControlsMounted,
    setAreDrawControlMounted,
  };

  return (
    <SearchDrawControlsCTX.Provider value={searchDrawCTXvalues}>
      <SearchStateCTX.Provider value={state}>
        <SearchDispatchCTX.Provider value={dispatch}>
          {children}
        </SearchDispatchCTX.Provider>
      </SearchStateCTX.Provider>
    </SearchDrawControlsCTX.Provider>
  );
}

// HACK: soporte de contexto para componentes de clase o
// pendientes de actualizar... DE ACÁ PA' BAJO VUELA PRRO
export function useSearchLegacyCTX() {
  const context = useContext(SearchLegacyCTX);
  if (!context) {
    throw new Error("useSearchLegacyCTX must be within the SearchCTX");
  }
  return context;
}

export type LegacyContextValues = {
  // state
  searchType: SrchType;
  areaType: AreaType | undefined;
  areaId: AreaIdBasic | undefined;
  areaNamesList: AreaIdBasic[];
  areaHa: number | undefined;
  areaLayer: ShapeLayer;
  shapeLayers: ShapeLayer[];
  rasterLayers: RasterLayer[];
  mapTitle: MapTitle;
  loadingLayer: boolean;
  layerError: boolean;
  showDrawControl: boolean;
  showAreaLayer: boolean;

  // RefContext
  drawControlsRef: MutableRefObject<L.Control.Draw | null>;
  areDrawControlsMounted: boolean;
  setAreDrawControlMounted: (mounted: boolean) => void;

  // dispatch
  setSearchType: (searchType: SrchType) => void;
  setAreaType: (areaType?: AreaType) => void;
  setAreaId: (areaId?: AreaIdBasic) => void;
  setAreaHa: (value?: number) => void;
  setAreaLayer: (layer?: geojson.GeoJsonObject) => void;
  setRasterLayers: (layers: Array<RasterLayer>) => void;
  setShapeLayers: (layers: Array<ShapeLayer>) => void;
  setShowAreaLayer: (active: boolean) => void;
  setLoadingLayer: (loading: boolean) => void;
  setLayerError: (error?: string) => void;
  setMapTitle: (mapTitle: MapTitle) => void;
  clearLayers: () => void;
};

export function LegacyCTX({ children }: { children: ReactNode }) {
  const searchState = useSearchStateCTX();
  const searchDispatch = useSearchDispatchCTX();
  const {
    drawControlsRef: drawControlsRef,
    areDrawControlsMounted,
    setAreDrawControlMounted,
  } = useSearchDrawControlsCTX();

  const expandedSearchDispatch = useMemo(
    () => ({
      setSearchType: (searchType: SrchType) =>
        searchDispatch({ type: SearchUpdated.SEARCH_TYPE, searchType }),

      setAreaHa: (areaHa: number | undefined) =>
        searchDispatch({ type: SearchUpdated.AREA_HA, areaHa: areaHa }),

      setRasterLayers: (rasterLayers: RasterLayer[]) =>
        searchDispatch({ type: SearchUpdated.RASTER_LAYERS, rasterLayers }),

      setShowAreaLayer: (showAreaLayer: boolean) =>
        searchDispatch({ type: SearchUpdated.SHOW_AREA_LAYER, showAreaLayer }),

      setLoadingLayer: (loadingLayer: boolean) =>
        searchDispatch({ type: SearchUpdated.LOADING_LAYER, loadingLayer }),

      setMapTitle: (mapTitle: MapTitle) =>
        searchDispatch({ type: SearchUpdated.MAP_TITLE, mapTitle }),

      clearLayers: () => searchDispatch({ type: SearchUpdated.CLEAR_LAYERS }),

      setLayerError: (layerError: string | undefined) =>
        searchDispatch({ type: SearchUpdated.LAYER_ERROR, layerError }),

      setAreaType: (areaType?: AreaType) =>
        searchDispatch({ type: SearchUpdated.AREA_TYPE, areaType }),

      setAreaId: (areaId?: AreaIdBasic) =>
        searchDispatch({ type: SearchUpdated.AREA_ID, areaId }),

      setAreaLayer: (areaLayerJSON: geojson.GeoJsonObject | undefined) =>
        searchDispatch({ type: SearchUpdated.AREA_LAYER, areaLayerJSON }),

      setShapeLayers: (shapeLayers: ShapeLayer[]) =>
        searchDispatch({ type: SearchUpdated.SHAPE_LAYERS, shapeLayers }),
    }),
    [searchDispatch],
  );

  const legacyCTXvalue = {
    ...searchState,
    ...expandedSearchDispatch,
    drawControlsRef,
    areDrawControlsMounted,
    setAreDrawControlMounted,
  };

  return (
    <SearchLegacyCTX.Provider value={legacyCTXvalue}>
      {children}
    </SearchLegacyCTX.Provider>
  );
}
