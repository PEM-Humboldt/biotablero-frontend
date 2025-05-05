import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import SearchContext, { srchType } from "pages/search/SearchContext";
import SearchAPI from "utils/searchAPI";
import { AreaIdBasic, AreaType, Polygon } from "pages/search/types/dashboard";
import isUndefinedOrNull from "utils/validations";
import MapViewer from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import Dashboard from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import BackendAPI from "utils/backendAPI";
import { rasterLayer, shapeLayer } from "pages/search/types/layers";
import matchColor from "utils/matchColor";
import { GeoJsonObject } from "geojson";
import L, { LatLngBoundsExpression } from "leaflet";

interface Props extends RouteComponentProps {
  // TODO: areaType y area depronto deben desaparecer, en el futuro la consulta al backend será solo por areaId
  areaType?: string;
  areaId?: number | string;
  // TODO: Tipar correctamente
  setHeaderNames: Function;
}

interface State {
  searchType: srchType;
  // TODO: areaType y area depronto deben desaparecer, en el futuro la consulta al backend será solo por areaId
  areaType?: AreaType;
  areaId?: AreaIdBasic;
  polygon?: Polygon;
  areaHa?: number;
  areaLayer: shapeLayer | null;
  shapeLayers: Array<shapeLayer>;
  rasterLayers: Array<rasterLayer>;
  bounds: LatLngBoundsExpression;
  mapTitle: {
    name: string;
    gradientData?: { from: number; to: number; colors: Array<string> };
  };
  loadingLayer: boolean;
  layerError: boolean;
  showDrawControl: boolean;
}

class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchType: "definedArea",
      areaLayer: null,
      rasterLayers: [],
      shapeLayers: [],
      bounds: [],
      mapTitle: { name: "" },
      loadingLayer: false,
      layerError: false,
      showDrawControl: true,
    };
  }

  async componentDidMount() {
    const { areaType, areaId, history } = this.props;
    if (!isUndefinedOrNull(areaType) && !isUndefinedOrNull(areaId)) {
      // TODO: Con el nuevo backend solo es llamar al endpoint que trae todos los detalles del area (que trae el objeto de tipo AreaId)
      // [Borrar] Con el backend actual:
      Promise.all([
        SearchAPI.requestAreaTypes(),
        SearchAPI.requestAreaIds(areaType!),
        BackendAPI.requestGeofenceDetails(areaType!, areaId!),
        BackendAPI.requestAreaLayer(areaType!, areaId!).request,
      ]).then(([types, ids, ha, layer]) => {
        const typeObj = types.find(({ id }) => id === areaType);
        const idObj = ids.find(({ id }) => id === areaId);
        this.setState({
          areaType: typeObj,
          areaId: idObj,
          areaHa: Number(ha.total_area),
          areaLayer: {
            id: "geofence",
            paneLevel: 1,
            json: layer,
            layerStyle: () => ({
              stroke: false,
              fillColor: matchColor("geofence")(),
              fillOpacity: 0.6,
            }),
          },
          polygon: layer,
        });
      });
    } else if (!isUndefinedOrNull(areaType)) {
      // TODO: Con el nuevo backend esto se va a borrar
      SearchAPI.requestAreaTypes().then((areaList) => {
        this.setState({
          areaType: areaList.find(({ id }) => id === areaType),
        });
      });
    } else if (isUndefinedOrNull(areaType) && !isUndefinedOrNull(areaId)) {
      // TODO: Este caso no existirá una vez se pueda identificar el área solo con el id (sin el areaType)
      history.replace(history.location.pathname);
    }
  }

  /**
   * Set the value for the search type
   *
   * @param {srchType} searchType
   */
  setSearchType = (searchType: srchType) => {
    this.setState({ searchType });
  };

  /**
   * Set id and name for the area type
   *
   * @param {AreaType} areaType
   */
  setAreaType = (areaType?: AreaType) => {
    this.setState({ areaType });
  };

  /**
   * Set id and name for the query area
   *
   * @param {AreaIdBasic} areaId
   */
  setAreaId = (areaId?: AreaIdBasic) => {
    this.setState({ areaId });
  };

  setPolygon = (polygon: Polygon) => {
    this.setState({ polygon });
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
   * @param {string} name
   * @param {string} gradientData
   */
  setMapTitle = (
    name: string,
    gradientData?: { from: number; to: number; colors: Array<string> }
  ) => {
    this.setState({
      mapTitle: { name: name, gradientData: gradientData },
    });
  };

  /**
   * Set the value for the geofence layer object
   *
   * @param {GeoJsonObject | null} layerJson
   */
  setAreaLayer = (layerJson: GeoJsonObject | null) => {
    if (layerJson) {
      const bounds = L.geoJSON(layerJson).getBounds();
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
        bounds,
      });
    } else {
      this.setState({
        areaLayer: null,
        bounds: [],
      });
    }
  };

  /**
   * Set values for raster layers array
   *
   * @param {Array<rasterLayer>} layers
   */
  setRasterLayers = (layers: Array<rasterLayer>) => {
    this.setState({ rasterLayers: layers });
  };

  /**
   * Set values for GeoJson layers array and determine if shows the geofence layer
   *
   * @param {Array<shapeLayer>} layers
   * @param {boolean} showAreaLayer
   */
  setShapeLayers = (
    layers: Array<shapeLayer>,
    showAreaLayer: boolean = false
  ) => {
    this.setState({
      shapeLayers: layers,
    });
  };

  /**
   * Set the state for loading layer an layer error
   *
   * @param {boolean} loading
   * @param {boolean} error
   */
  setLoadingLayer = (loading: boolean, error: boolean) => {
    this.setState({
      loadingLayer: loading,
      layerError: error,
    });
  };

  /**
   * Set the state for shown the draw control in MapViewer
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
   * Clear state when back button is clicked
   *
   * @param {GeoJsonObject | null} layerJson
   */
  handlerBackButton = () => {
    this.setState({
      areaId: undefined,
      areaType: undefined,
      areaHa: undefined,
      searchType: "definedArea",
      areaLayer: null,
      rasterLayers: [],
      shapeLayers: [],
      bounds: [],
      mapTitle: { name: "" },
      loadingLayer: false,
      layerError: false,
    });
  };

  render() {
    const {
      searchType,
      areaType,
      areaId,
      polygon,
      areaHa,
      areaLayer,
      bounds,
      shapeLayers,
      rasterLayers,
      mapTitle,
      loadingLayer,
      layerError,
      showDrawControl,
    } = this.state;

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
          polygon: polygon,
          areaHa: areaHa,
          setSearchType: this.setSearchType,
          setAreaType: this.setAreaType,
          setAreaId: this.setAreaId,
          setPolygon: this.setPolygon,
          setAreaHa: this.setAreaHa,
          setAreaLayer: this.setAreaLayer,
          //
          setRasterLayers: this.setRasterLayers,
          setShapeLayers: this.setShapeLayers,
          setLoadingLayer: this.setLoadingLayer,
          setMapTitle: this.setMapTitle,
        }}
      >
        <div className="appSearcher wrappergrid">
          <MapViewer
            geoServerUrl={GeoServerAPI.getRequestURL()}
            loadingLayer={loadingLayer}
            layerError={layerError}
            shapeLayers={shapeLayers}
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
