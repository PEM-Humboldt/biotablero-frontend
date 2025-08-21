import { useEffect, useState } from "react";
import { RouteComponentProps, useHistory, useLocation } from "react-router-dom";
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
import {
  MapTitle,
  rasterLayer as RasterLayer,
  shapeLayer as ShapeLayer,
} from "pages/search/types/layers";
import matchColor from "pages/search/utils/matchColor";
import { GeoJsonObject } from "geojson";
import L from "leaflet";
import { Names } from "types/layoutTypes";
import { hasInvalidGeoJson } from "pages/search/utils/GeoJsonUtils";

interface SearchProps {
  setHeaderNames: React.Dispatch<React.SetStateAction<Names>>;
}

// TODO: OBSERVACIONES:
// 1. estandarizar uso NULL o UNDEFINED
// 2. Revisar si setLayerError hace un llamado mas abajo, pues la funcion anterior convertia la cadena en bool
// 3. UN TIPO, UNA IDEA... de string a bool de LayerError, es un boool
// pero en el componente el setter era una funcion que pasaba de bool a str
// 4. Desagregar mas el componente => URL, mapa y sidebar
// 5. Fallbacks para url errada o con parámetros inexistentes
// 6. Proyección del mapa rarita -> Huila, Arauca

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

  // Hacer al componente autónomo, que pueda acceder directamente a la URL
  const history = useHistory();
  const { search, pathname } = useLocation();

  const { setHeaderNames } = props;

  // Obtiene la data para la carga
  useEffect(() => {
    const query = new URLSearchParams(search);
    const areaIdURL = query.get("area_id");
    const areaTypeURL = query.get("area_type");

    if (
      areaIdURL === undefined ||
      areaIdURL === null ||
      areaTypeURL === undefined ||
      areaTypeURL === null
    ) {
      return;
    }

    Promise.all([
      SearchAPI.requestAreaTypes(),
      SearchAPI.requestAreaIds(areaTypeURL),
      SearchAPI.requestAreaInfo(areaIdURL),
    ]).then(([areaTypes, areaIds, areaInfo]) => {
      const typeObj = areaTypes.find(({ id }) => id === areaTypeURL);
      const idObj = areaIds.find(({ id }) => id === areaInfo.id);

      setAreaType(typeObj);
      setAreaId(idObj);
      setAreaHa(Number(areaInfo.area));
      setHeaderNames({
        parent: idObj?.name ?? "",
        child: typeObj?.label ?? "",
      });
      updateAreaLayer(areaInfo.geometry);
    });
  }, [search]);

  // Actualiza la URL
  useEffect(() => {
    if (!areaType) {
      return;
    }

    let urlNewParams = `?area_type=${areaType.id}`;
    if (areaId) {
      urlNewParams += `&area_id=${areaId.id}`;
    }

    // Si la url está al día, previene re-renderizados
    if (search !== urlNewParams) {
      history.push(urlNewParams);
      setHeaderNames({
        parent: areaType.label,
        child: areaId?.name ?? "",
      });
    }
  }, [areaType, areaId, history, search, setHeaderNames]);

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

  // NOTE: Valor derivado, no debe estar en un state
  const bounds =
    areaLayer.id === "geofence" && areaLayer.json
      ? L.geoJSON(areaLayer.json).getBounds()
      : [];

  const contextValues: SearchContextValues = {
    areaType: areaType,
    areaId: areaId,
    areaHa: areaHa,
    setSearchType: setSearchType,
    setAreaType: setAreaType,
    setAreaId: setAreaId,
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
