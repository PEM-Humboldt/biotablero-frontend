import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SearchContext, {
  drawControlHandler as DrawControlHandler,
  SearchContextValues,
  srchType as SrchType,
} from "pages/search/SearchContext";
import SearchAPI from "pages/search/utils/searchAPI";
import { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import { isUndefinedOrNull } from "utils/validations";
import MapViewer from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import Dashboard from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import { MapTitle, RasterLayer, ShapeLayer } from "pages/search/types/layers";
import matchColor from "pages/search/utils/matchColor";
import { GeoJsonObject } from "geojson";
import L from "leaflet";
import { Names } from "types/layoutTypes";
import { hasInvalidGeoJson } from "pages/search/utils/GeoJsonUtils";

interface SearchProps {
  setHeaderNames: React.Dispatch<React.SetStateAction<Names>>;
}

export const Search = (props: SearchProps) => {
  const [searchType, setSearchType] = useState<SrchType>("definedArea");
  const [areaType, setAreaType] = useState<AreaType>();
  const [areaId, setAreaId] = useState<AreaIdBasic>();
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

  const history = useHistory();
  const { search, pathname } = useLocation();

  const { setHeaderNames } = props;

  useEffect(() => {
    const query = new URLSearchParams(search);
    const areaTypeURL = query.get("area_type");
    const areaIdURL = query.get("area_id");

    if (areaTypeURL === null) {
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

        if (areaIdURL === null) {
          setHeaderNames({ ...headerNames, parent: "" });
          return;
        }

        const areaInfo = await SearchAPI.requestAreaInfo(areaIdURL);
        const idObj = areaIds.find(({ id }) => id === areaInfo.id);

        setAreaId(idObj);
        setAreaHa(Number(areaInfo.area));
        setHeaderNames({ ...headerNames, parent: idObj?.name ?? "" });
        updateAreaLayer(areaInfo.geometry);
      } catch (err) {
        console.error(
          `Something happened while fetching the area's data: ${err}`
        );
      }
    };

    syncSearchConsole();
  }, [search]);

  const handleUpdateURL = (
    areaTypeParam: AreaType | undefined,
    areaIdParam: AreaIdBasic | undefined
  ) => {
    if (areaTypeParam === undefined) {
      history.push(pathname);
      return;
    }

    let urlNewParams = `?area_type=${areaTypeParam.id}`;
    if (areaIdParam) {
      urlNewParams += `&area_id=${areaIdParam.id}`;
    }

    history.push(urlNewParams);
  };

  const handleAreaTypeUpdate = (areaTypeProp: AreaType) => {
    setAreaType(areaTypeProp);
    setAreaId(undefined);
    handleUpdateURL(areaTypeProp, undefined);
  };

  const handleAreaIdUpdate = (areaIdProp: AreaIdBasic) => {
    setAreaId(areaIdProp);
    handleUpdateURL(areaType, areaIdProp);
  };

  const updateAreaLayer = (layerJSON?: GeoJsonObject) => {
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
  };

  const updateShapeLayers = (layers: ShapeLayer[]) => {
    if (!hasInvalidGeoJson(layers)) {
      setShapeLayers(layers);
    }
  };

  const clearLayers = () => {
    setShapeLayers([]);
    setRasterLayers([]);
    setLoadingLayer(false);
    setLayerError(false);
    setMapTitle({ name: "" });
    setShowAreaLayer(false);
  };

  const handlerBackButton = () => {
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
    history.replace(pathname);
  };

  const bounds =
    areaLayer.id === "geofence" && areaLayer.json
      ? L.geoJSON(areaLayer.json).getBounds()
      : [];

  const contextValues: SearchContextValues = {
    areaType: areaType,
    areaId: areaId,
    areaHa: areaHa,
    setSearchType: setSearchType,
    setAreaType: handleAreaTypeUpdate,
    setAreaId: handleAreaIdUpdate,
    setAreaHa: setAreaHa,
    setRasterLayers: setRasterLayers,
    setShowAreaLayer: setShowAreaLayer,
    setLoadingLayer: setLoadingLayer,
    setLayerError: (error?: string) => setLayerError(!!error),
    setMapTitle: setMapTitle,
    clearLayers: clearLayers,
    onEditControlMounted: onEditControlMounted,
    setOnEditControlMounted: setOnEditControlMounted,
    searchType: searchType ?? "definedArea",
    setAreaLayer: updateAreaLayer, // helper,
    setShapeLayers: updateShapeLayers, // helper,
  };

  const showDashboard =
    !isUndefinedOrNull(searchType) &&
    !isUndefinedOrNull(areaType) &&
    !isUndefinedOrNull(areaId) &&
    !isUndefinedOrNull(areaLayer) &&
    !isUndefinedOrNull(areaHa);

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
};
