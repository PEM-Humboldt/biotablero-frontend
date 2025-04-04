import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import SearchContext, { srchType } from "pages/search/SearchContext";
import SearchAPI from "utils/searchAPI";
import { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import isUndefinedOrNull from "utils/validations";
import MapViewer from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import Dashboard from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import { MapTitle, rasterLayer, shapeLayer } from "pages/search/types/layers";
import matchColor from "utils/matchColor";
import { GeoJsonObject } from "geojson";
import L, { LatLngBoundsExpression } from "leaflet";
import { Names } from "types/layoutTypes";
import GeoJsonUtils from "utils/GeoJsonUtils";

interface Props extends RouteComponentProps {
  // TODO: areaType y area depronto deben desaparecer, en el futuro la consulta al backend será solo por areaId
  areaType?: string;
  areaId?: number | string;
  // TODO: Tipar correctamente
  setHeaderNames: React.Dispatch<React.SetStateAction<Names>>;
}

interface State {
  searchType: srchType;
  // TODO: areaType y area depronto deben desaparecer, en el futuro la consulta al backend será solo por areaId
  areaType?: AreaType;
  areaId?: AreaIdBasic;
  areaHa?: number;
  areaLayer: shapeLayer;
  shapeLayers: Array<shapeLayer>;
  rasterLayers: Array<rasterLayer>;
  showAreaLayer: boolean;
  bounds: LatLngBoundsExpression;
  mapTitle: MapTitle;
  loadingLayer: boolean;
  layerError: boolean;
}

class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchType: "definedArea",
      areaLayer: { id: "", paneLevel: 0, json: { type: "FeatureCollection" } },
      rasterLayers: [],
      shapeLayers: [],
      showAreaLayer: false,
      bounds: [],
      mapTitle: { name: "" },
      loadingLayer: false,
      layerError: false,
    };
  }

  async componentDidMount() {
    const { areaType, areaId, setHeaderNames } = this.props;
    if (!isUndefinedOrNull(areaType) && !isUndefinedOrNull(areaId)) {
      Promise.all([
        SearchAPI.requestAreaTypes(),
        SearchAPI.requestAreaIds(areaType!),
        SearchAPI.requestAreaInfo(areaId!)
      ]).then(([types, ids, areaId]) => {
        const typeObj = types.find(({ id }) => id === areaType);
        const idObj = ids.find(({ id }) => id === areaId.id);

        this.setState({
          areaType: typeObj,
          areaId: idObj,
          areaHa: Number(areaId.area),
          areaLayer: {
            id: "geofence",
            paneLevel: 1,
            json: GeoJsonUtils.castAreaIdToFeatureCollection(areaId),
            layerStyle: () => ({
              stroke: false,
              fillColor: matchColor("geofence")(),
              fillOpacity: 0.6,
            }),
          },
        });
        setHeaderNames({ parent: idObj!.name, child: typeObj!.label });
      });
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

    const { history } = this.props;
    history.push(`?area_type=${areaType!.id}`);
  };

  /**
   * Set id and name for the query area and set the header names
   *
   * @param {AreaIdBasic} areaId
   */
  setAreaId = (areaId?: AreaIdBasic) => {
    this.setState({ areaId });

    const { setHeaderNames, history } = this.props;
    const { areaType } = this.state;

    setHeaderNames({ parent: this.state.areaType!.label, child: areaId!.name });
    history.push(`?area_type=${areaType!.id}&area_id=${areaId!.id}`);
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
        areaLayer: {
          id: "",
          paneLevel: 0,
          json: { type: "FeatureCollection" },
        },
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
   */
  setShapeLayers = (layers: Array<shapeLayer>) => {
    if (!GeoJsonUtils.hasInvalidGeoJson(layers))
      this.setState({ shapeLayers: layers });
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
   * Prepare the layers vars in the context
   *
   */

  clearLayers = () => {
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
    this.setState({
      areaId: undefined,
      areaType: undefined,
      areaHa: undefined,
      searchType: "definedArea",
      areaLayer: { id: "", paneLevel: 0, json: { type: "FeatureCollection" } },
      rasterLayers: [],
      shapeLayers: [],
      bounds: [],
      mapTitle: { name: "" },
      loadingLayer: false,
      layerError: false,
    });

    const { setHeaderNames, history } = this.props;
    setHeaderNames({ parent: "", child: "" });
    history.replace(history.location.pathname);
  };

  render() {
    const {
      searchType,
      areaType,
      areaId,
      areaHa,
      areaLayer,
      bounds,
      shapeLayers,
      rasterLayers,
      mapTitle,
      loadingLayer,
      layerError,
    } = this.state;

    let toShow = <Selector />;
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
          searchType: "definedArea",
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
            drawPolygonEnabled={false}
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
