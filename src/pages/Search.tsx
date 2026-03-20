import { useCallback, useEffect, useReducer, useRef } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router";
import L from "leaflet";
import type * as geojson from "geojson";

import { LegacyCTX, SearchCTX } from "pages/search/hooks/SearchContext";
import SearchAPI from "pages/search/api/searchAPI";
import type { AreaIdBasic } from "pages/search/types/dashboard";
import { MapViewer } from "pages/search/MapViewer";
import GeoServerAPI from "@api/geoServer";
import { Dashboard } from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import {
  searchInitialState,
  searchReducer,
  SearchUpdated,
} from "pages/search/hooks/SearchReducer";

export function Search() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [searchState, searchDispatch] = useReducer(
    searchReducer,
    searchInitialState,
  );
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const skipURLRead = useRef(false);

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
    if (skipURLRead.current) {
      skipURLRead.current = false;
      return;
    }

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
        const headerNames = { subtitle: typeObj?.label ?? "" };

        if (areaIdURL === null) {
          layoutDispatch({
            type: LayoutUpdated.HEADER_NAMES,
            newHeader: { ...headerNames, title: "" },
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
          newHeader: { ...headerNames, title: idObj?.name ?? "" },
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

        const areaInfo = await SearchAPI.requestAreaInfo(
          areaPolygon.polygon_id,
        );
        const areaBasic: AreaIdBasic = {
          id: areaPolygon.polygon_id,
          name: "polígono",
          area: areaInfo.area,
          area_type: searchState.areaType!,
        };

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

  useEffect(() => {
    if (skipURLRead.current) {
      return;
    }

    if (!searchState.areaType) {
      if (search !== "") {
        void navigate(pathname);
      }
      return;
    }

    let params = `?area_type=${searchState.areaType.id}`;

    if (searchState.areaId) {
      params += `&area_id=${searchState.areaId.id}`;
    }

    if (params !== search) {
      void navigate(params);
    }
  }, [searchState.areaType, searchState.areaId, search, navigate, pathname]);

  const handleGoBackClick = () => {
    skipURLRead.current = true;

    layoutDispatch({
      type: LayoutUpdated.HEADER_NAMES,
      newHeader: { title: "", subtitle: "" },
    });
    searchDispatch({ type: SearchUpdated.GO_BACK });
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
    <SearchCTX state={searchState} dispatch={searchDispatch}>
      <LegacyCTX>
        <div className="flex h-full">
          <MapViewer
            bounds={bounds}
            polygon={null}
            loadPolygonInfo={() => {}}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />

          <div className="flex-[1_1_40%] flex-col order-2">
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
