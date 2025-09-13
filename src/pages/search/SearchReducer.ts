import type { DrawControlHandler, SrchType } from "pages/search/SearchContext";
import type {
  AreaId,
  AreaIdBasic,
  AreaType,
} from "pages/search/types/dashboard";
import type {
  MapTitle,
  RasterLayer,
  ShapeLayer,
} from "pages/search/types/layers";
import { hasInvalidGeoJson } from "pages/search/utils/GeoJsonUtils";
import matchColor from "pages/search/utils/matchColor";
import type * as geojson from "geojson";

export enum SearchUpdated {
  SEARCH_TYPE = "searchType",
  AREA_TYPE = "areaType",
  AREA_ID = "areaId",
  AREA_NAMES_LIST = "areaNamesList",
  AREA_HA = "areaHa",
  AREA_LAYER = "areaLayer",
  SHAPE_LAYERS = "shapeLayers",
  RASTER_LAYERS = "rasterLayers",
  MAP_TITLE = "mapTitle",
  LOADING_LAYER = "loadingLayer",
  LAYER_ERROR = "layerError",
  DRAW_CONTROLS = "drawControls", // legacy -> onEditControlMounted
  SHOW_DRAW_CONTROL = "showDrawControl",
  SHOW_AREA_LAYER = "showAreaLayer",
  CLEAR_LAYERS = "clearLayers",
  CONSOLE_PARTIAL = "partialConsole",
  CONSOLE_FULL = "consoleFull",
  CONSOLE_DRAW = "consoleDraw",
  GO_BACK = "goBack",
  RESET = "reset",
  WILDCARD = "wildcard",
}

export type SearchState = {
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
  drawControls: DrawControlHandler | (() => void);
  showDrawControl: boolean;
  showAreaLayer: boolean;
};

export type SearchActions =
  | { type: SearchUpdated.SEARCH_TYPE; searchType: SrchType } // -> searchType
  | { type: SearchUpdated.AREA_TYPE; areaType: AreaType } // handleAreaTypeUpdate
  | { type: SearchUpdated.AREA_ID; areaId: AreaIdBasic } // handleAreaIdUpdate
  | { type: SearchUpdated.AREA_NAMES_LIST; areaNamesList: AreaIdBasic[] }
  | { type: SearchUpdated.AREA_HA; areaHa: number | undefined }
  | {
      type: SearchUpdated.AREA_LAYER;
      areaLayerJSON: geojson.GeoJsonObject | undefined;
    } // handleAreaLayerUpdate
  | { type: SearchUpdated.SHAPE_LAYERS; shapeLayers: ShapeLayer[] }
  | { type: SearchUpdated.RASTER_LAYERS; rasterLayers: RasterLayer[] } // handleShapeLayersUpdate
  | { type: SearchUpdated.MAP_TITLE; mapTitle: MapTitle }
  | { type: SearchUpdated.LOADING_LAYER; loadingLayer: boolean }
  | { type: SearchUpdated.LAYER_ERROR; layerError: boolean } // handleSetLayerError
  | { type: SearchUpdated.DRAW_CONTROLS; drawControls: DrawControlHandler } // -> onEditControlMounted
  | { type: SearchUpdated.SHOW_DRAW_CONTROL; showDrawControl: boolean }
  | { type: SearchUpdated.SHOW_AREA_LAYER; showAreaLayer: boolean }
  | { type: SearchUpdated.GO_BACK } // handlerBackButton
  | { type: SearchUpdated.CLEAR_LAYERS } // clearLayer
  | {
      type: SearchUpdated.CONSOLE_PARTIAL;
      payload: { areaType: AreaType | undefined; areaNamesList: AreaIdBasic[] };
    } // search/useEffect/syncSearchConsole
  | {
      type: SearchUpdated.CONSOLE_FULL;
      payload: {
        areaType: AreaType | undefined;
        areaNamesList: AreaIdBasic[];
        areaId: AreaIdBasic | undefined;
        areaInfo: AreaId;
      };
    } // search/useEffect/syncSearchConsole
  | {
      type: SearchUpdated.CONSOLE_DRAW;
      payload: { areaId: AreaIdBasic; areaInfo: AreaId };
    } // search/useEffect/syncDrawConsole
  | { type: SearchUpdated.RESET }
  | { type: SearchUpdated.WILDCARD; payload: Partial<SearchState> };

const searchClearLayersState: Pick<
  SearchState,
  | "shapeLayers"
  | "rasterLayers"
  | "loadingLayer"
  | "layerError"
  | "mapTitle"
  | "showAreaLayer"
> = {
  shapeLayers: [],
  rasterLayers: [],
  loadingLayer: false,
  layerError: false,
  mapTitle: { name: "" },
  showAreaLayer: false,
};

const searchGoBackState: Omit<
  SearchState,
  "areaNamesList" | "drawControls" | "showDrawControl"
> = {
  ...searchClearLayersState,
  searchType: "definedArea",
  areaType: undefined,
  areaId: undefined,
  areaHa: undefined,
  areaLayer: { id: "", paneLevel: 0, json: { type: "FeatureCollection" } },
};

export const searchInitialState: SearchState = {
  ...searchGoBackState,
  areaNamesList: [],
  drawControls: () => {},
  showDrawControl: false,
};

const areaLayerUpdate = (
  layerJSON: geojson.GeoJsonObject | undefined,
): ShapeLayer => {
  if (layerJSON) {
    return {
      id: "geofence",
      paneLevel: 1,
      json: layerJSON,
      layerStyle: () => ({
        stroke: false,
        // WARN: de dónde sale el valor que pide la funcion???
        fillColor: matchColor("geofence")() ?? undefined,
        fillOpacity: 0.6,
      }),
    };
  }
  return {
    id: "",
    paneLevel: 0,
    json: { type: "FeatureCollection" },
  };
};

export function searchReducer(
  state: SearchState,
  action: SearchActions,
): SearchState {
  switch (action.type) {
    case SearchUpdated.SEARCH_TYPE:
      return { ...state, searchType: action.searchType };
    case SearchUpdated.AREA_TYPE:
      return { ...state, areaType: action.areaType, areaId: undefined };
    case SearchUpdated.AREA_ID:
      return { ...state, areaId: action.areaId };
    case SearchUpdated.AREA_NAMES_LIST:
      return { ...state, areaNamesList: action.areaNamesList };
    case SearchUpdated.AREA_HA:
      return { ...state, areaHa: action.areaHa };
    case SearchUpdated.AREA_LAYER:
      return { ...state, areaLayer: areaLayerUpdate(action.areaLayerJSON) };
    case SearchUpdated.SHAPE_LAYERS:
      if (hasInvalidGeoJson(action.shapeLayers)) {
        return state;
      }
      return { ...state, shapeLayers: action.shapeLayers };
    case SearchUpdated.RASTER_LAYERS:
      return { ...state, rasterLayers: action.rasterLayers };
    case SearchUpdated.MAP_TITLE:
      return { ...state, mapTitle: action.mapTitle };
    case SearchUpdated.LOADING_LAYER:
      return { ...state, loadingLayer: action.loadingLayer };
    case SearchUpdated.LAYER_ERROR:
      return { ...state, layerError: !!action.layerError };
    case SearchUpdated.DRAW_CONTROLS:
      return { ...state, drawControls: action.drawControls };
    case SearchUpdated.SHOW_DRAW_CONTROL:
      return { ...state, showDrawControl: action.showDrawControl };
    case SearchUpdated.SHOW_AREA_LAYER:
      return { ...state, showAreaLayer: action.showAreaLayer };
    case SearchUpdated.CLEAR_LAYERS:
      return { ...state, ...searchClearLayersState };
    case SearchUpdated.CONSOLE_PARTIAL:
      return { ...state, ...action.payload };
    case SearchUpdated.CONSOLE_FULL:
      return {
        ...state,
        areaType: action.payload.areaType,
        areaNamesList: action.payload.areaNamesList,
        areaId: action.payload.areaId,
        areaHa: Number(action.payload.areaInfo.area),
        areaLayer: areaLayerUpdate(action.payload.areaInfo.geometry),
      };
    case SearchUpdated.CONSOLE_DRAW:
      return {
        ...state,
        areaId: action.payload.areaId,
        areaHa: Number(action.payload.areaInfo.area),
        areaLayer: areaLayerUpdate(action.payload.areaInfo.geometry),
      };
    case SearchUpdated.GO_BACK:
      return { ...state, ...searchGoBackState };
    case SearchUpdated.RESET:
      return searchInitialState;
    case SearchUpdated.WILDCARD:
      return { ...state, ...action.payload };
    default:
      console.warn("Unknown requested searchReducer action");
      return state;
  }
}
