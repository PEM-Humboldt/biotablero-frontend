import { useContext, createContext, type Dispatch, useMemo } from "react";
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
export type DrawControlHandler = (control: any) => void;
import type * as geojson from "geojson";

const SearchStateCTX = createContext<SearchState | null>(null);
const SearchDispatchCTX = createContext<Dispatch<SearchActions> | null>(null);

export const useSearchStateCTX = () => {
  const context = useContext(SearchStateCTX);
  if (!context) {
    throw new Error("useSearchState must be within the SearchStateContext");
  }
  return context;
};

export const useSearchDispatchCTX = () => {
  const dispatch = useContext(SearchDispatchCTX);
  if (!dispatch) {
    throw new Error("useSearchDispatch must be within the SearchStateContext");
  }
  return dispatch;

  // NOTE: Revisar los paquetes de exportacion
  //
  // return useMemo(
  //   () => ({
  //     setSearchType: (searchType: SrchType) =>
  //       dispatch({ type: SearchUpdated.SEARCH_TYPE, searchType }),
  //
  //     setAreaHa: (areaHa: number | undefined) =>
  //       dispatch({ type: SearchUpdated.AREA_HA, areaHa: areaHa }),
  //
  //     setRasterLayers: (rasterLayers: RasterLayer[]) =>
  //       dispatch({ type: SearchUpdated.RASTER_LAYERS, rasterLayers }),
  //
  //     setShowAreaLayer: (showAreaLayer: boolean) =>
  //       dispatch({ type: SearchUpdated.SHOW_AREA_LAYER, showAreaLayer }),
  //
  //     setLoadingLayer: (loadingLayer: boolean) =>
  //       dispatch({ type: SearchUpdated.LOADING_LAYER, loadingLayer }),
  //
  //     setMapTitle: (mapTitle: MapTitle) =>
  //       dispatch({ type: SearchUpdated.MAP_TITLE, mapTitle }),
  //
  //     clearLayers: () => dispatch({ type: SearchUpdated.CLEAR_LAYERS }),
  //
  //     setOnEditControlMounted: (drawControls: DrawControlHandler) =>
  //       dispatch({ type: SearchUpdated.DRAW_CONTROLS, drawControls }),
  //
  //     setLayerError: (layerError: boolean) =>
  //       dispatch({ type: SearchUpdated.LAYER_ERROR, layerError }),
  //
  //     setAreaType: (areaType: AreaType) =>
  //       dispatch({ type: SearchUpdated.AREA_TYPE, areaType }),
  //
  //     setAreaId: (areaId: AreaIdBasic) =>
  //       dispatch({ type: SearchUpdated.AREA_ID, areaId }),
  //
  //     setAreaLayer: (areaLayerJSON: geojson.GeoJsonObject | undefined) =>
  //       dispatch({ type: SearchUpdated.AREA_LAYER, areaLayerJSON }),
  //
  //     // NOTE: debería ser o setRasterLayers o los tipos deberian ser shapes
  //     setShapeLayers: (rasterLayers: RasterLayer[]) =>
  //       dispatch({ type: SearchUpdated.RASTER_LAYERS, rasterLayers }),
  //   }),
  //   [dispatch],
  // );
};

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

// WARN: de acá pa' bajo es temporal, se va a penas se migre el componente
export type SearchContextValues = {
  // nuevas en contexto
  areaLayer: ShapeLayer;
  shapeLayers: ShapeLayer[];
  rasterLayers: RasterLayer[];
  mapTitle: MapTitle;
  loadingLayer: boolean;
  layerError: boolean;
  drawControls: DrawControlHandler | (() => void);
  showDrawControl: boolean;
  showAreaLayer: boolean;

  // contexto Viejo
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
  setOnEditControlMounted(handler: () => void): void;
};

export const SearchContext = createContext<SearchContextValues>({
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
