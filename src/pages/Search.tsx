import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import L from "leaflet";
import type * as geojson from "geojson";

import {
  SearchContext,
  type DrawControlHandler,
  type SearchContextValues,
  type SrchType,
} from "pages/search/SearchContext";
import SearchAPI from "pages/search/utils/searchAPI";
import type { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import MapViewer from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import Dashboard from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import type {
  MapTitle,
  RasterLayer,
  ShapeLayer,
} from "pages/search/types/layers";
import matchColor from "pages/search/utils/matchColor";
import type { Names } from "types/layoutTypes";
import { hasInvalidGeoJson } from "pages/search/utils/GeoJsonUtils";

interface SearchProps {
  setHeaderNames: React.Dispatch<React.SetStateAction<Names>>;
}

export function Search(props: SearchProps) {
  const [searchType, setSearchType] = useState<SrchType>("definedArea");
  const [areaType, setAreaType] = useState<AreaType>();
  const [areaId, setAreaId] = useState<AreaIdBasic>();
  const [areaNamesList, setAreaNamesList] = useState<AreaIdBasic[]>([]);
  const [areaHa, setAreaHa] = useState<number | undefined>();
  const [areaLayer, setAreaLayer] = useState<ShapeLayer>({
    id: "",
    paneLevel: 0,
    json: { type: "FeatureCollection" },
  });
  const [shapeLayers, setShapeLayers] = useState<ShapeLayer[]>([]);
  const [rasterLayers, setRasterLayers] = useState<RasterLayer[]>([]);
  const [mapTitle, setMapTitle] = useState<MapTitle>({ name: "" });
  const [loadingLayer, setLoadingLayer] = useState<boolean>(false);
  const [layerError, setLayerError] = useState<boolean>(false);
  const [showDrawControl, setShowDrawControl] = useState<boolean>(true);
  const [onEditControlMounted, setOnEditControlMounted] =
    useState<DrawControlHandler>(() => {});
  const [showAreaLayer, setShowAreaLayer] = useState<boolean>(false);
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const { setHeaderNames } = props;

  const handleAreaLayerUpdate = useCallback(
    (layerJSON?: geojson.GeoJsonObject) => {
      if (layerJSON) {
        setAreaLayer({
          id: "geofence",
          paneLevel: 1,
          json: layerJSON,
          layerStyle: () => ({
            stroke: false,
            fillColor: matchColor("geofence")(),
            fillOpacity: 0.6,
          }),
        });
      } else {
        setAreaLayer({
          id: "",
          paneLevel: 0,
          json: { type: "FeatureCollection" },
        });
      }
    },
    []
  );

  useEffect(() => {
    const query = new URLSearchParams(search);
    const areaTypeURL = query.get("area_type");
    const areaIdURL = query.get("area_id");

    if (searchType !== "definedArea" || areaTypeURL === null) {
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
        setAreaType(typeObj);
        setAreaNamesList(areaIds);

        if (areaIdURL === null) {
          setHeaderNames({ ...headerNames, parent: "" });
          return;
        }

        const areaInfo = await SearchAPI.requestAreaInfo(areaIdURL);
        const idObj = areaIds.find(({ id }) => id === areaInfo.id);

        setAreaId(idObj);
        setAreaHa(Number(areaInfo.area));
        setHeaderNames({ ...headerNames, parent: idObj?.name ?? "" });
        handleAreaLayerUpdate(areaInfo.geometry);
      } catch (err) {
        console.error(`Error while fetching the area's data: ${err}`);
      }
    };

    syncSearchConsole();
  }, [search, setHeaderNames, handleAreaLayerUpdate, searchType]);

  useEffect(() => {
    if (
      areaType?.id !== "custom" ||
      !areaLayer.json ||
      (areaId && typeof areaId.id === "number")
    ) {
      return;
    }

    const syncDrawConsole = async () => {
      const geojson = areaLayer.json as geojson.Feature<geojson.Polygon>;

      try {
        const areaPolygon = await SearchAPI.requestAreaPolygon(geojson);
        const areaBasic: AreaIdBasic = {
          id: areaPolygon.polygon_id,
          name: "polígono",
          area_type: areaType,
        };
        setAreaId(areaBasic);

        const areaInfo = await SearchAPI.requestAreaInfo(
          areaPolygon.polygon_id
        );
        setAreaHa(Number(areaInfo.area));
        handleAreaLayerUpdate(areaInfo.geometry);
      } catch (err) {
        console.error(`Error processing custom polygon: ${err}`);
      }
    };

    syncDrawConsole();
  }, [areaType, areaLayer, areaId, handleAreaLayerUpdate]);

  const handleUpdateURL = useCallback(
    (
      areaTypeParam: AreaType | undefined,
      areaIdParam: AreaIdBasic | undefined
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
    [navigate, pathname]
  );

  const handleAreaTypeUpdate = useCallback(
    (areaTypeProp: AreaType) => {
      setAreaType(areaTypeProp);
      setAreaId(undefined);
      handleUpdateURL(areaTypeProp, undefined);
    },
    [handleUpdateURL]
  );

  const handleAreaIdUpdate = useCallback(
    (areaIdProp: AreaIdBasic) => {
      setAreaId(areaIdProp);
      handleUpdateURL(areaType, areaIdProp);
    },
    [areaType, handleUpdateURL]
  );

  const handleShapeLayersUpdate = useCallback((layers: ShapeLayer[]) => {
    if (!hasInvalidGeoJson(layers)) {
      setShapeLayers(layers);
    }
  }, []);

  const handleSetLayerError = useCallback(
    (error?: string) => setLayerError(!!error),
    []
  );

  const clearLayers = useCallback(() => {
    setShapeLayers([]);
    setRasterLayers([]);
    setLoadingLayer(false);
    setLayerError(false);
    setMapTitle({ name: "" });
    setShowAreaLayer(false);
  }, []);

  const handlerBackButton = useCallback(() => {
    setAreaId(undefined);
    setAreaType(undefined);
    setAreaHa(undefined);
    setSearchType("definedArea");
    setAreaLayer({ id: "", paneLevel: 0, json: { type: "FeatureCollection" } });
    setRasterLayers([]);
    setShapeLayers([]);
    setMapTitle({ name: "" });
    setShowAreaLayer(false);
    setLoadingLayer(false);
    setLayerError(false);
    setHeaderNames({ parent: "", child: "" });
    navigate(pathname);
  }, [navigate, pathname, setHeaderNames]);

  const bounds =
    areaLayer.id === "geofence" && areaLayer.json
      ? L.geoJSON(areaLayer.json).getBounds()
      : [];

  const contextValues = useMemo<SearchContextValues>(
    () => ({
      areaType,
      areaId,
      areaNamesList,
      areaHa,
      searchType: searchType ?? "definedArea",
      onEditControlMounted,
      setSearchType,
      setAreaHa,
      setRasterLayers,
      setShowAreaLayer,
      setLoadingLayer,
      setMapTitle,
      clearLayers,
      setOnEditControlMounted,
      setLayerError: handleSetLayerError,
      setAreaType: handleAreaTypeUpdate,
      setAreaId: handleAreaIdUpdate,
      setAreaLayer: handleAreaLayerUpdate,
      setShapeLayers: handleShapeLayersUpdate,
    }),
    [
      areaHa,
      areaId,
      areaNamesList,
      areaType,
      handleAreaIdUpdate,
      handleAreaTypeUpdate,
      onEditControlMounted,
      searchType,
      handleSetLayerError,
      handleAreaLayerUpdate,
      handleShapeLayersUpdate,
      clearLayers,
    ]
  );
  const showDashboard =
    searchType !== null &&
    areaType !== undefined &&
    areaId !== undefined &&
    areaHa !== undefined;

  return (
    <SearchContext.Provider value={contextValues}>
      <div className="appSearcher wrappergrid">
        <MapViewer
          loadingLayer={loadingLayer}
          layerError={layerError}
          rasterLayers={rasterLayers}
          mapTitle={mapTitle}
          bounds={bounds}
          polygon={null}
          loadPolygonInfo={() => {}}
          showDrawControl={showDrawControl && searchType === "drawPolygon"}
          shapeLayers={
            showAreaLayer ? [areaLayer, ...shapeLayers] : shapeLayers
          }
          geoServerUrl={GeoServerAPI.getRequestURL()}
        />

        <div className="contentView">
          {showDashboard ? (
            <Dashboard handlerBackButton={handlerBackButton} />
          ) : (
            <Selector setShowDrawControl={setShowDrawControl} />
          )}
        </div>
      </div>
    </SearchContext.Provider>
  );
}
