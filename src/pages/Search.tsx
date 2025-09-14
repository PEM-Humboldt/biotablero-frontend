import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import L from "leaflet";
import type * as geojson from "geojson";

import { LegacyCTX, SearchCTX } from "pages/search/SearchContext";
import SearchAPI from "pages/search/utils/searchAPI";
import type { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import { MapViewer } from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import { Dashboard } from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import type { UiManager } from "app/Layout";
import { LayoutUpdated } from "app/layout/layoutReducer";
import {
  type SearchActions,
  searchInitialState,
  searchReducer,
  SearchUpdated,
} from "pages/search/SearchReducer";

export function Search() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [searchState, searchDispatch] = useReducer(
    searchReducer,
    searchInitialState,
  );
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const drawControlsRef = useRef<L.Control.Draw | null>(null);
  const [isDrawControlMounted, setDrawControlMounted] = useState(false);

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
    (areaType: AreaType | undefined, areaId: AreaIdBasic | undefined) => {
      if (areaType === undefined) {
        navigate(pathname);
        return;
      }

      let urlNewParams = `?area_type=${areaType.id}`;
      if (areaId !== undefined) {
        urlNewParams += `&area_id=${areaId.id}`;
      }

      navigate(urlNewParams);
    },
    [navigate, pathname],
  );

  const searchDispatchComplete = useCallback(
    (action: SearchActions) => {
      searchDispatch(action);
      if (action.type === SearchUpdated.AREA_TYPE) {
        handleUpdateURL(action.areaType, undefined);
      }
      if (action.type === SearchUpdated.AREA_ID) {
        handleUpdateURL(searchState.areaType, action.areaId);
      }
    },
    [handleUpdateURL, searchState.areaType],
  );

  const handleGoBackClick = () => {
    layoutDispatch({
      type: LayoutUpdated.HEADER_NAMES,
      newHeader: { parent: "", child: "" },
    });
    searchDispatch({ type: SearchUpdated.GO_BACK });
    navigate(pathname);
  };

  const handleShowDrawControls = useCallback(
    (show: boolean) => {
      searchDispatch({
        type: SearchUpdated.SHOW_DRAW_CONTROL,
        showDrawControl: show,
      });
    },
    [searchDispatch],
  );

  const bounds =
    searchState.areaLayer.id === "geofence" && searchState.areaLayer.json
      ? L.geoJSON(searchState.areaLayer.json).getBounds()
      : [];

  const showDashboard =
    searchState.areaType !== undefined &&
    searchState.areaId !== undefined &&
    searchState.areaHa !== undefined;

  return (
    <SearchCTX state={searchState} dispatch={searchDispatchComplete}>
      <LegacyCTX>
        <div className="appSearcher wrappergrid">
          <MapViewer
            bounds={bounds}
            polygon={null}
            loadPolygonInfo={() => {}}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />

          <div className="contentView">
            {showDashboard ? (
              <Dashboard goBackClick={handleGoBackClick} />
            ) : (
              <Selector showDrawControls={handleShowDrawControls} />
            )}
          </div>
        </div>
      </LegacyCTX>
    </SearchCTX>
  );
}

