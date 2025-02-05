import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import SearchContext, {
  rasterLayer,
  srchType,
} from "pages/search/SearchContext";
import SearchAPI from "utils/searchAPI";
import { AreaIdBasic, AreaType, Polygon } from "pages/search/types/dashboard";
import isUndefinedOrNull from "utils/validations";
import MapViewer from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import Dashboard from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import BackendAPI from "utils/backendAPI";

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
  mapTitle: {
    name: string;
    gradientData?: { from: number; to: number; colors: Array<string> };
  };
}

class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { searchType: "definedArea", mapTitle: { name: "" } };
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

  setSearchType = (searchType: srchType) => {
    this.setState({ searchType });
  };

  setAreaType = (areaType?: AreaType) => {
    this.setState({ areaType });
  };

  setAreaId = (areaId?: AreaIdBasic) => {
    this.setState({ areaId });
  };

  setPolygon = (polygon: Polygon) => {
    this.setState({ polygon });
  };

  setAreaHa = (value: number) => {
    this.setState({ areaHa: value });
  };

  setMapTitle = (
    name: string,
    gradientData?: { from: number; to: number; colors: Array<string> }
  ) => {
    this.setState({
      mapTitle: { name: name, gradientData: gradientData },
    });
  };

  render() {
    const { searchType, areaType, areaId, polygon, areaHa, mapTitle } =
      this.state;
    let toShow = <Selector />;
    if (
      !isUndefinedOrNull(searchType) &&
      !isUndefinedOrNull(polygon) &&
      !isUndefinedOrNull(areaType) &&
      !isUndefinedOrNull(areaId) &&
      !isUndefinedOrNull(areaHa)
    ) {
      toShow = <Dashboard />;
    }
    return (
      <SearchContext.Provider
        value={{
          searchType: "definedArea",
          areaType: areaType,
          areaId: areaId,
          polygon: polygon,
          areaHa: areaHa,
          setSearchType: this.setSearchType,
          setAreaType: this.setAreaType,
          setAreaId: this.setAreaId,
          setPolygon: this.setPolygon,
          setAreaHa: this.setAreaHa,
          //
          setPolygonValues: () => {},
          setRasterLayers: () => {},
          setShapeLayers: () => {},
          setLoadingLayer: () => {},
          setMapTitle: this.setMapTitle,
        }}
      >
        <div className="appSearcher wrappergrid">
          <MapViewer
            geoServerUrl={GeoServerAPI.getRequestURL()}
            loadingLayer={false}
            layerError={false}
            rasterLayers={[]}
            drawPolygonEnabled={false}
            loadPolygonInfo={() => {}}
            mapTitle={mapTitle}
            mapBounds={[
              [-4.2316872, -82.1243666],
              [16.0571269, -66.85119073],
            ]}
            rasterBounds={[]}
            polygon={null}
            layers={[]}
          />
          <div className="contentView">{toShow}</div>
        </div>
      </SearchContext.Provider>
    );
  }
}

export default withRouter(Search);
