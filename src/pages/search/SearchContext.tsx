import {
  useContext,
  createContext,
  useMemo,
  type Dispatch,
  type ReactNode,
} from "react";

import {
  SearchUpdated,
  type SearchActions,
  type SearchState,
} from "pages/search/SearchReducer";
import type {
  MapTitle,
  RasterLayer,
  ShapeLayer,
} from "pages/search/types/layers";
import type { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
export type SrchType = "definedArea" | "drawPolygon" | null;
export type DrawControlHandler = (control: unknown) => void;
import type * as geojson from "geojson";

const SearchStateCTX = createContext<SearchState | null>(null);
const SearchDispatchCTX = createContext<Dispatch<SearchActions> | null>(null);
export const SearchLegacyCTX = createContext<LegacyContextValues | null>(null);

export function useSearchStateCTX() {
  const context = useContext(SearchStateCTX);
  if (!context) {
    throw new Error("useSearchStateCTX must be within the SearchStateContext");
  }
  return context;
}

export function useSearchDispatchCTX() {
  const dispatch = useContext(SearchDispatchCTX);
  if (!dispatch) {
    throw new Error(
      "useSearchDispatchCTX must be within the SearchStateContext",
    );
  }
  return dispatch;
}

export function useSearchLegacyCTX() {
  const context = useContext(SearchLegacyCTX);
  if (!context) {
    throw new Error("useSearchLegacyCTX must be within the SearchStateContext");
  }
  return context;
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
  return (
    <SearchStateCTX.Provider value={state}>
      <SearchDispatchCTX.Provider value={dispatch}>
        {children}
      </SearchDispatchCTX.Provider>
    </SearchStateCTX.Provider>
  );
}

// HACK: soporte de contexto para componentes de clase pendiente de actualizar
// DE ACÁ PA' BAJO VUELA PRRO
export type LegacyContextValues = {
  // state
  searchType: SrchType;
  areaType: AreaType;
  areaId: AreaIdBasic | undefined;
  areaNamesList: AreaIdBasic[];
  areaHa: number | undefined;
  areaLayer: ShapeLayer;
  shapeLayers: ShapeLayer[];
  rasterLayers: RasterLayer[];
  mapTitle: MapTitle;
  loadingLayer: boolean;
  layerError: boolean;
  drawControls?: DrawControlHandler | (() => void);
  showDrawControl: boolean;
  showAreaLayer: boolean;

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

  onEditControlMounted?: DrawControlHandler;
  setOnEditControlMounted: (handler: () => void) => void;
};

export function LegacyCTX({ children }: { children: ReactNode }) {
  const searchState = useSearchStateCTX();
  const searchDispatch = useSearchDispatchCTX();

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

      setOnEditControlMounted: (drawControls: DrawControlHandler) =>
        searchDispatch({ type: SearchUpdated.DRAW_CONTROLS, drawControls }),

      setLayerError: (layerError: string | undefined) =>
        searchDispatch({ type: SearchUpdated.LAYER_ERROR, layerError }),

      setAreaType: (areaType: AreaType) =>
        searchDispatch({ type: SearchUpdated.AREA_TYPE, areaType }),

      setAreaId: (areaId: AreaIdBasic) =>
        searchDispatch({ type: SearchUpdated.AREA_ID, areaId }),

      setAreaLayer: (areaLayerJSON: geojson.GeoJsonObject | undefined) =>
        searchDispatch({ type: SearchUpdated.AREA_LAYER, areaLayerJSON }),

      setShapeLayers: (shapeLayers: ShapeLayer[]) =>
        searchDispatch({ type: SearchUpdated.SHAPE_LAYERS, shapeLayers }),
    }),
    [searchDispatch],
  );

  const legacyCTXvalue = useMemo(
    () => ({ ...searchState, ...expandedSearchDispatch }),
    [searchState, expandedSearchDispatch],
  );

  return (
    <SearchLegacyCTX.Provider value={legacyCTXvalue}>
      {children}
    </SearchLegacyCTX.Provider>
  );
}
