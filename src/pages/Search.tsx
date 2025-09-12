import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import L from "leaflet";
import type * as geojson from "geojson";

import {
  type DrawControlHandler,
  type SrchType,
  SearchContext,
} from "pages/search/SearchContext";
import SearchAPI from "pages/search/utils/searchAPI";
import type { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import MapViewer from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import Dashboard from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import type { UiManager } from "app/Layout";
import { LayoutUpdated } from "app/layout/layoutReducer";
import {
  searchInitialState,
  searchReducer,
  SearchUpdated,
} from "pages/search/SearchReducer";
import type { MapTitle, RasterLayer } from "pages/search/types/layers";

export function Search() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [searchState, searchDispatch] = useReducer(
    searchReducer,
    searchInitialState,
  );
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Consultas Geográficas",
        logos: new Set(),
        className: "fullgrid",
      },
    });
  }, [layoutDispatch]);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const areaTypeURL = query.get("area_type");
    const areaIdURL = query.get("area_id");

    if (searchState.searchType !== "definedArea" || areaTypeURL === null) {
      return;
    }

    const syncSearchConsole = async () => {
      try {
        const [areaTypes, areaIds] = await Promise.all([
          SearchAPI.requestAreaTypes(),
          SearchAPI.requestAreaIds(areaTypeURL),
        ]);
        const typeObj = areaTypes.find(({ id }) => id === areaTypeURL);
        const headerNames = { child: typeObj?.label ?? "" };

        if (areaIdURL === null) {
          layoutDispatch({
            type: LayoutUpdated.HEADER_NAMES,
            newHeader: { ...headerNames, parent: "" },
          });

          searchDispatch({
            type: SearchUpdated.CONSOLE_PARTIAL,
            payload: { areaType: typeObj, areaNamesList: areaIds },
          });
          return;
        }

        const areaInfo = await SearchAPI.requestAreaInfo(areaIdURL);
        const idObj = areaIds.find(({ id }) => id === areaInfo.id);

        layoutDispatch({
          type: LayoutUpdated.HEADER_NAMES,
          newHeader: { ...headerNames, parent: idObj?.name ?? "" },
        });

        searchDispatch({
          type: SearchUpdated.CONSOLE_FULL,
          payload: {
            areaType: typeObj,
            areaNamesList: areaIds,
            areaId: idObj,
            areaInfo: areaInfo,
          },
        });
      } catch (err) {
        console.error("Error while fetching the area's data:", err);
      }
    };

    void syncSearchConsole();
  }, [search, layoutDispatch, searchState.searchType]);

  useEffect(() => {
    if (
      searchState.areaType?.id !== "custom" ||
      !searchState.areaLayer.json ||
      (searchState.areaId && typeof searchState.areaId.id === "number")
    ) {
      return;
    }

    const syncDrawConsole = async () => {
      const geojson = searchState.areaLayer
        .json as geojson.Feature<geojson.Polygon>;

      try {
        const areaPolygon = await SearchAPI.requestAreaPolygon(geojson);
        const areaBasic: AreaIdBasic = {
          id: areaPolygon.polygon_id,
          name: "polígono",
          area_type: searchState.areaType!,
        };

        const areaInfo = await SearchAPI.requestAreaInfo(
          areaPolygon.polygon_id,
        );

        searchDispatch({
          type: SearchUpdated.CONSOLE_DRAW,
          payload: {
            areaId: areaBasic,
            areaInfo: areaInfo,
          },
        });
      } catch (err) {
        console.error("Error processing custom polygon:", err);
      }
    };

    void syncDrawConsole();
  }, [searchState.areaId, searchState.areaLayer.json, searchState.areaType]);

  const handleUpdateURL = useCallback(
    (
      areaTypeParam: AreaType | undefined,
      areaIdParam: AreaIdBasic | undefined,
    ) => {
      if (areaTypeParam === undefined) {
        navigate(pathname);
        return;
      }

      let urlNewParams = `?area_type=${areaTypeParam.id}`;
      if (areaIdParam) {
        urlNewParams += `&area_id=${areaIdParam.id}`;
      }

      navigate(urlNewParams);
    },
    [navigate, pathname],
  );

  const handleAreaTypeUpdate = useCallback(
    (areaTypeProp: AreaType) => {
      searchDispatch({ type: SearchUpdated.AREA_TYPE, areaType: areaTypeProp });
      handleUpdateURL(areaTypeProp, undefined);
    },
    [handleUpdateURL],
  );

  const handleAreaIdUpdate = useCallback(
    (areaIdProp: AreaIdBasic) => {
      searchDispatch({ type: SearchUpdated.AREA_ID, areaId: areaIdProp });
      handleUpdateURL(searchState.areaType, areaIdProp);
    },
    [searchState.areaType, handleUpdateURL],
  );

  const bounds =
    searchState.areaLayer.id === "geofence" && searchState.areaLayer.json
      ? L.geoJSON(searchState.areaLayer.json).getBounds()
      : [];

  const contextValues = useMemo(
    () => ({
      areaType: searchState.areaType,
      areaId: searchState.areaId,
      areaNamesList: searchState.areaNamesList,
      areaHa: searchState.areaHa,
      searchType: searchState.searchType ?? "definedArea",
      onEditControlMounted: searchState.drawControls ?? (() => {}),
      //
      setSearchType: (searchType: SrchType) => {
        searchDispatch({
          type: SearchUpdated.SEARCH_TYPE,
          searchType: searchType,
        });
      },
      setAreaHa: (areaHa: number | undefined) => {
        searchDispatch({
          type: SearchUpdated.AREA_HA,
          areaHa: areaHa,
        });
      },
      setRasterLayers: (rasterLayers: RasterLayer[]) => {
        searchDispatch({
          type: SearchUpdated.RASTER_LAYERS,
          rasterLayers: rasterLayers,
        });
      },
      setShowAreaLayer: (showAreaLayer: boolean) => {
        searchDispatch({
          type: SearchUpdated.SHOW_AREA_LAYER,
          showAreaLayer: showAreaLayer,
        });
      },
      setLoadingLayer: (loadingLayer: boolean) => {
        searchDispatch({
          type: SearchUpdated.LOADING_LAYER,
          loadingLayer: loadingLayer,
        });
      },
      setMapTitle: (mapTitle: MapTitle) => {
        searchDispatch({
          type: SearchUpdated.MAP_TITLE,
          mapTitle: mapTitle,
        });
      },
      clearLayers: () => {
        searchDispatch({ type: SearchUpdated.CLEAR_LAYERS });
      },
      setOnEditControlMounted: (drawControls: DrawControlHandler) => {
        searchDispatch({
          type: SearchUpdated.DRAW_CONTROLS,
          drawControls: drawControls,
        });
      },
      setLayerError: (layerError: boolean) => {
        searchDispatch({
          type: SearchUpdated.LAYER_ERROR,
          layerError: layerError,
        });
      },
      setAreaType: handleAreaTypeUpdate,
      setAreaId: handleAreaIdUpdate,
      setAreaLayer: (areaLayerJSON: geojson.GeoJsonObject | undefined) => {
        searchDispatch({
          type: SearchUpdated.AREA_LAYER,
          areaLayerJSON: areaLayerJSON,
        });
      },
      setShapeLayers: (rasterLayers: RasterLayer[]) => {
        searchDispatch({
          type: SearchUpdated.RASTER_LAYERS,
          rasterLayers: rasterLayers,
        });
      },
    }),
    [
      searchState.areaType,
      searchState.areaId,
      searchState.areaNamesList,
      searchState.areaHa,
      searchState.searchType,
      searchState.drawControls,
      handleAreaTypeUpdate,
      handleAreaIdUpdate,
    ],
  );

  const showDashboard =
    searchState.areaType !== undefined &&
    searchState.areaId !== undefined &&
    searchState.areaHa !== undefined;

  return (
    <SearchContext.Provider value={contextValues}>
      <div className="appSearcher wrappergrid">
        <MapViewer
          loadingLayer={searchState.loadingLayer}
          layerError={searchState.layerError}
          rasterLayers={searchState.rasterLayers}
          mapTitle={searchState.mapTitle}
          bounds={bounds}
          polygon={null}
          loadPolygonInfo={() => {}}
          showDrawControl={
            searchState.showDrawControl &&
            searchState.searchType === "drawPolygon"
          }
          shapeLayers={
            searchState.showAreaLayer
              ? [searchState.areaLayer, ...searchState.shapeLayers]
              : searchState.shapeLayers
          }
          geoServerUrl={GeoServerAPI.getRequestURL()}
        />

        <div className="contentView">
          {showDashboard ? (
            <Dashboard
              handlerBackButton={() => {
                searchDispatch({ type: SearchUpdated.GO_BACK });
              }}
            />
          ) : (
            <Selector
              setShowDrawControl={(showDrawControl: boolean) => {
                searchDispatch({
                  type: SearchUpdated.SHOW_DRAW_CONTROL,
                  showDrawControl: showDrawControl,
                });
              }}
            />
          )}
        </div>
      </div>
    </SearchContext.Provider>
  );
}
