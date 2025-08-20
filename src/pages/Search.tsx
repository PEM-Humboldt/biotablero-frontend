import { Component, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import SearchContext, {
  drawControlHandler as DrawControlHandler,
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
import L, { LatLngBoundsExpression } from "leaflet";
import { Names } from "types/layoutTypes";
import { hasInvalidGeoJson } from "pages/search/utils/GeoJsonUtils";

// TODO: REVISAR EL TIPDADO ANTES DE SEGUIR
interface SearchProps extends RouteComponentProps {
  areaType?: string;
  areaId?: string;
  setHeaderNames: React.Dispatch<React.SetStateAction<Names>>;
}

interface State {
  searchType: SrchType;
  // TODO: areaType y area depronto deben desaparecer, en el futuro la consulta al backend será solo por areaId
  areaType?: AreaType;
  areaId?: AreaIdBasic;
  areaHa?: number;
  areaLayer: ShapeLayer;
  shapeLayers: Array<ShapeLayer>;
  rasterLayers: Array<RasterLayer>;
  mapTitle: MapTitle;
  loadingLayer: boolean;
  layerError: boolean;
  showDrawControl: boolean;
  onEditControlMounted: DrawControlHandler;

  showAreaLayer: boolean;
}

// Bound se calcula ahora en render para evitar un estado derivado a partir del  areaLayer o multiples fuentes de verdad

// searchType,
// areaType,
// areaId,
// areaHa,
// areaLayer,
// shapeLayers,
// rasterLayers,
// mapTitle,
// loadingLayer,
// layerError,
// showDrawControl,
// onEditControlMounted,

export const SearchFN = (props: SearchProps) => {
  const [searchType, setSearchType] = useState<SrchType>("definedArea");
  const [areaType, setAreaType] = useState<AreaType | undefined>();
  const [areaId, setAreaId] = useState<AreaIdBasic | undefined>();
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

  useEffect(() => {
    const areaIdProp = props.areaId;
    const areaTypeProp = props.areaType;
    const setHeaderNamesProp = props.setHeaderNames;

    // NOTE: El helper isUndefinedOrNull corta la inferencia de tipos por
    // lo que no lo usé para validar si avanza con la sincronización
    if (
      areaIdProp === undefined ||
      areaIdProp === null ||
      areaTypeProp === undefined ||
      areaTypeProp === null
    ) {
      return;
    }

    Promise.all([
      SearchAPI.requestAreaTypes(),
      SearchAPI.requestAreaIds(areaTypeProp),
      SearchAPI.requestAreaInfo(areaIdProp),
    ]).then(([areaTypes, areaIds, areaInfo]) => {
      const typeObj = areaTypes.find(({ id }) => id === areaTypeProp);
      const idObj = areaIds.find(({ id }) => id === areaInfo.id);

      setAreaType(typeObj);
      setAreaId(idObj);
      setAreaHa(Number(areaInfo.area));
      setHeaderNamesProp({
        parent: idObj?.name ?? "",
        child: typeObj?.label ?? "",
      });
      updateAreaLayer(areaInfo.geometry);
    });
  });

  // NOTE: prv setAreaLayer
  const updateAreaLayer = (layerJSON?: GeoJsonObject) => {
    setAreaLayer(() => {
      if (layerJSON) {
        return {
          id: "geofence",
          paneLevel: 1,
          json: layerJSON,
          layerStyle: () => ({
            stroke: false,
            fillColor: matchColor("geofence")(),
            fillOpacity: 0.6,
          }),
        };
      }
      return {
        id: "",
        paneLevel: 0,
        json: { type: "FeatureCollection" },
      };
    });
  };

  // NOTE: prv setAreaType
  const updateURLAreaType = (areaTypeProp: AreaType) => {
    setAreaType(areaTypeProp);

    if (areaTypeProp) {
      // TODO: usar directamente el hook del router
      const { history } = props;
      history.push(`?area_type=${areaType!.id}`);
    }
  };

  // NOTE: prv setAreaId
  const updateAreaId = (areaIdProp: AreaIdBasic) => {
    setAreaId(areaIdProp);

    if (areaIdProp && areaType) {
      // TODO: usar directamente el hook del router
      const { setHeaderNames, history } = props;
      setHeaderNames({
        parent: areaType.label,
        child: areaIdProp.name,
      });
      history.push(`?area_type=${areaType.id}&area_id=${areaIdProp.id}`);
    }
  };

  // NOTE: prv setShapeLayers
  const updateShapeLayers = (layers: ShapeLayer[]) => {
    if (!hasInvalidGeoJson(layers)) {
      setShapeLayers(layers);
    }
  };

  // NOTE: prv clearLayers
  const clearLayers = () => {
    setShapeLayers([]);
    setRasterLayers([]);
    setLoadingLayer(false);
    setLayerError(false);
    setMapTitle({ name: "" });
    setShowAreaLayer(false);
  };

  // NOTE: prv handlerBackButton
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

    // TODO: usar directamente el hook del router
    const { setHeaderNames, history } = props;
    setHeaderNames({ parent: "", child: "" });
    history.replace(history.location.pathname);
  };

  const bounds =
    areaLayer.id === "geofence" && areaLayer.json
      ? L.geoJSON(areaLayer.json).getBounds()
      : [];
};

class Search extends Component<SearchProps, State> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      searchType: "definedArea",
      areaLayer: { id: "", paneLevel: 0, json: { type: "FeatureCollection" } },
      rasterLayers: [],
      shapeLayers: [],
      showAreaLayer: false,
      mapTitle: { name: "" },
      loadingLayer: false,
      layerError: false,
      showDrawControl: true,
      onEditControlMounted: () => {},
    };
  }

  async componentDidMount() {
    const { areaType, areaId, setHeaderNames } = this.props;
    if (!isUndefinedOrNull(areaType) && !isUndefinedOrNull(areaId)) {
      Promise.all([
        SearchAPI.requestAreaTypes(),
        SearchAPI.requestAreaIds(areaType!),
        SearchAPI.requestAreaInfo(areaId!),
      ]).then(([areaTypes, areaIDs, areaInfo]) => {
        const typeObj = areaTypes.find(({ id }) => id === areaType);
        const idObj = areaIDs.find(({ id }) => id === areaInfo.id);

        this.setState({
          areaType: typeObj,
          areaId: idObj,
          areaHa: Number(areaInfo.area),
        });
        setHeaderNames({ parent: idObj!.name, child: typeObj!.label });
        this.setAreaLayer(areaInfo.geometry);
      });
    }
  }

  /**
   * Set the value for the search type
   *
   * @param {SrchType} searchType
   */
  setSearchType = (searchType: SrchType) => {
    this.setState({ searchType });
  };

  /**
   * Set id and name for the area type
   *
   * @param {AreaType} areaType
   */
  setAreaType = (areaType?: AreaType) => {
    // WARN: LISTO
    this.setState({ areaType });

    if (areaType) {
      const { history } = this.props;
      history.push(`?area_type=${areaType!.id}`);
    }
  };

  /**
   * Set id and name for the query area and set the header names
   *
   * @param {AreaIdBasic} areaId
   */
  setAreaId = (areaId?: AreaIdBasic) => {
    // WARN: LISTO
    this.setState({ areaId });

    const { areaType } = this.state;
    if (areaId && areaType) {
      const { setHeaderNames, history } = this.props;

      setHeaderNames({
        parent: this.state.areaType!.label,
        child: areaId!.name,
      });
      history.push(`?area_type=${areaType!.id}&area_id=${areaId!.id}`);
    }
  };

  /**
   * Set the value for the area surface in Ha
   *
   * @param {number} value
   */
  setAreaHa = (value: number) => {
    this.setState({ areaHa: value });
  };

  /**
   * Set values for map title component
   *
   * @param {MapTitle} mapTitle
   */
  setMapTitle = (mapTitle: MapTitle) => {
    this.setState({
      mapTitle: mapTitle,
    });
  };

  /**
   * Set the value for the geofence layer object
   *
   * @param {GeoJsonObject | undefined} layerJson
   */
  setAreaLayer = (layerJson?: GeoJsonObject) => {
    // WARN: LISTO
    if (layerJson) {
      const areaLayer = {
        id: "geofence",
        paneLevel: 1,
        json: layerJson,
        layerStyle: () => ({
          stroke: false,
          fillColor: matchColor("geofence")(),
          fillOpacity: 0.6,
        }),
      };

      this.setState({
        areaLayer,
      });
    } else {
      this.setState({
        areaLayer: {
          id: "",
          paneLevel: 0,
          json: { type: "FeatureCollection" },
        },
      });
    }
  };

  /**
   * Set values for raster layers array
   *
   * @param {Array<RasterLayer>} layers
   */
  setRasterLayers = (layers: Array<RasterLayer>) => {
    this.setState({ rasterLayers: layers });
  };

  /**
   * Set values for GeoJson layers array and determine if shows the geofence layer
   *
   * @param {Array<ShapeLayer>} layers
   */
  setShapeLayers = (layers: Array<ShapeLayer>) => {
    // WARN: LISTO
    if (!hasInvalidGeoJson(layers)) this.setState({ shapeLayers: layers });
  };

  /**
   * Set true the value for show area layer
   *
   * @param {boolean} active
   */
  setShowAreaLayer = (active: boolean) => {
    this.setState({ showAreaLayer: active });
  };

  /**
   * Set the state for loading layer
   *
   * @param {boolean} loading
   */
  setLoadingLayer = (loading: boolean) => {
    this.setState({
      loadingLayer: loading,
    });
  };

  /**
   * Set the state for layer error
   *
   * @param {boolean} error
   */
  setLayerError = (error?: string) => {
    this.setState({
      layerError: !!error,
    });
  };

  /**
   * Set the state to show the draw control in MapViewer
   *
   * @param {boolean} loading
   * @param {boolean} error
   */
  setShowDrawControl = (show: boolean) => {
    this.setState({
      showDrawControl: show,
    });
  };
  /**
   * Prepare the layers vars in the context
   */
  clearLayers = () => {
    // WARN: LISTO
    this.setShapeLayers([]);
    this.setRasterLayers([]);
    this.setLoadingLayer(false);
    this.setLayerError();
    this.setMapTitle({ name: "" });
    this.setShowAreaLayer(false);
  };

  /**
   * Clear state when back button is clicked
   */
  handlerBackButton = () => {
    // WARN: LISTO
    this.setState({
      areaId: undefined,
      areaType: undefined,
      areaHa: undefined,
      searchType: "definedArea",
      areaLayer: { id: "", paneLevel: 0, json: { type: "FeatureCollection" } },
      rasterLayers: [],
      shapeLayers: [],
      mapTitle: { name: "" },
      showAreaLayer: false,
      loadingLayer: false,
      layerError: false,
    });

    const { setHeaderNames, history } = this.props;
    setHeaderNames({ parent: "", child: "" });
    history.replace(history.location.pathname);
  };

  /**
   * Sets the handler function to control the leaflet-draw component
   *
   * @param handler {DrawControlHandler} function to handle draw component
   */
  setOnEditControlMounted = (handler: DrawControlHandler) => {
    this.setState({ onEditControlMounted: handler });
  };

  render() {
    const {
      searchType,
      areaType,
      areaId,
      areaHa,
      areaLayer,
      shapeLayers,
      rasterLayers,
      mapTitle,
      loadingLayer,
      layerError,
      showDrawControl,
      onEditControlMounted,
    } = this.state;

    const bounds =
      areaLayer.id === "geofence" && areaLayer.json
        ? L.geoJSON(areaLayer.json).getBounds()
        : [];

    let toShow = <Selector setShowDrawControl={this.setShowDrawControl} />;
    if (
      !isUndefinedOrNull(searchType) &&
      !isUndefinedOrNull(areaType) &&
      !isUndefinedOrNull(areaId) &&
      !isUndefinedOrNull(areaLayer) &&
      !isUndefinedOrNull(areaHa)
    ) {
      toShow = <Dashboard handlerBackButton={this.handlerBackButton} />;
    }
    return (
      <SearchContext.Provider
        value={{
          searchType: searchType ?? "definedArea",
          areaType: areaType,
          areaId: areaId,
          areaHa: areaHa,
          setSearchType: this.setSearchType,
          setAreaType: this.setAreaType,
          setAreaId: this.setAreaId,
          setAreaHa: this.setAreaHa,
          setAreaLayer: this.setAreaLayer,
          setRasterLayers: this.setRasterLayers,
          setShapeLayers: this.setShapeLayers,
          setShowAreaLayer: this.setShowAreaLayer,
          setLoadingLayer: this.setLoadingLayer,
          setLayerError: this.setLayerError,
          setMapTitle: this.setMapTitle,
          clearLayers: this.clearLayers,
          onEditControlMounted: onEditControlMounted,
          setOnEditControlMounted: this.setOnEditControlMounted,
        }}
      >
        <div className="appSearcher wrappergrid">
          <MapViewer
            geoServerUrl={GeoServerAPI.getRequestURL()}
            loadingLayer={loadingLayer}
            layerError={layerError}
            shapeLayers={
              this.state.showAreaLayer
                ? [areaLayer, ...shapeLayers]
                : shapeLayers
            }
            rasterLayers={rasterLayers}
            showDrawControl={showDrawControl && searchType === "drawPolygon"}
            loadPolygonInfo={() => {}}
            mapTitle={mapTitle}
            bounds={bounds}
            polygon={null}
          />
          <div className="contentView">{toShow}</div>
        </div>
      </SearchContext.Provider>
    );
  }
}

export default withRouter(Search);
