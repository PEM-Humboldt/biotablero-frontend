# Guía para Migrar el Componente `Search` a un Componente de Función

Esta guía detalla el proceso para migrar el componente de clase `Search`, ubicado en `src/pages/Search.tsx`, a un componente de función de React. Esta migración es un paso hacia la modernización de la aplicación, con miras a futuras actualizaciones a React 19 y React Router 7.

## Contexto

El componente `Search` es un componente de clase que maneja una cantidad significativa de estado y lógica de negocio. Utiliza el HOC (Higher-Order Component) `withRouter` para acceder a las propiedades del enrutador.

La migración a un componente de función nos permitirá usar Hooks, lo que simplificará el código, mejorará la legibilidad y nos preparará para las próximas versiones de React y React Router.

## Pasos para la Migración

### 1. Estructura Básica del Componente de Función

Primero, convierte la clase en una función. El HOC `withRouter` ya no es necesario, ya que usaremos hooks de React Router.

**Antes:**
```tsx
class SearchComponent extends Component<Props, State> {
  // ...
}
export const Search = withRouter(SearchComponent);
```

**Después:**
```tsx
import { useHistory, useLocation } from 'react-router-dom';

// ... otras importaciones

export const Search: React.FC<Props> = (props) => {
  // ... hooks y lógica aquí
  return (
    // ... JSX
  );
};
```

### 2. Migración del Estado con `useState`

El estado de la clase se migrará a múltiples llamadas al hook `useState`. Esto hace que el manejo del estado sea más granular y explícito.

**Antes:**
```tsx
this.state = {
  searchType: "definedArea",
  areaLayer: { id: "", paneLevel: 0, json: { type: "FeatureCollection" } },
  // ... otros estados
};
```

**Después:**
```tsx
const [searchType, setSearchType] = useState<srchType>("definedArea");
const [areaLayer, setAreaLayer] = useState<shapeLayer>({ id: "", paneLevel: 0, json: { type: "FeatureCollection" } });
const [rasterLayers, setRasterLayers] = useState<Array<rasterLayer>>([]);
const [shapeLayers, setShapeLayers] = useState<Array<shapeLayer>>([]);
const [showAreaLayer, setShowAreaLayer] = useState<boolean>(false);
const [bounds, setBounds] = useState<LatLngBoundsExpression>([]);
const [mapTitle, setMapTitle] = useState<MapTitle>({ name: "" });
const [loadingLayer, setLoadingLayer] = useState<boolean>(false);
const [layerError, setLayerError] = useState<boolean>(false);
const [showDrawControl, setShowDrawControl] = useState<boolean>(true);
const [onEditControlMounted, setOnEditControlMounted] = useState<drawControlHandler>(() => {});
const [areaType, setAreaType] = useState<AreaType | undefined>();
const [areaId, setAreaId] = useState<AreaIdBasic | undefined>();
const [areaHa, setAreaHa] = useState<number | undefined>();
```

### 3. Reemplazo de Métodos de Ciclo de Vida con `useEffect`

El método `componentDidMount` se reemplazará con el hook `useEffect`.

**Antes:**
```tsx
async componentDidMount() {
  const { areaType, areaId, setHeaderNames } = this.props;
  if (!isUndefinedOrNull(areaType) && !isUndefinedOrNull(areaId)) {
    // ... lógica de fetch
  }
}
```

**Después:**
```tsx
useEffect(() => {
  const { areaType: areaTypeParam, areaId: areaIdParam, setHeaderNames } = props;
  if (!isUndefinedOrNull(areaTypeParam) && !isUndefinedOrNull(areaIdParam)) {
    Promise.all([
      SearchAPI.requestAreaTypes(),
      SearchAPI.requestAreaIds(areaTypeParam!),
      SearchAPI.requestAreaInfo(areaIdParam!),
    ]).then(([types, ids, areaIdInfo]) => {
      const typeObj = types.find(({ id }) => id === areaTypeParam);
      const idObj = ids.find(({ id }) => id === areaIdInfo.id);

      setAreaType(typeObj);
      setAreaId(idObj);
      setAreaHa(Number(areaIdInfo.area));
      setHeaderNames({ parent: idObj!.name, child: typeObj!.label });
      // setAreaLayer se migrará a una función normal
      // ...
    });
  }
}, [props.areaType, props.areaId, props.setHeaderNames]);
```

### 4. Migración de Métodos de Clase

Todos los métodos de la clase (`setSearchType`, `setAreaType`, etc.) se convertirán en funciones dentro del componente funcional.

**Antes:**
```tsx
setSearchType = (searchType: srchType) => {
  this.setState({ searchType });
};
```

**Después:**
```tsx
const setSearchType = (searchType: srchType) => {
  setSearchType(searchType);
};
```

### 5. Manejo del Enrutador con Hooks

Reemplaza el uso de `this.props.history` con el hook `useHistory`. Para futuras actualizaciones a React Router v6/v7, `useHistory` será reemplazado por `useNavigate`, pero la migración será más sencilla desde `useHistory`.

**Antes:**
```tsx
const { history } = this.props;
history.push(`?area_type=${areaType!.id}`);
```

**Después:**
```tsx
const history = useHistory();
history.push(`?area_type=${areaType!.id}`);
```

### 6. Código Completo del Componente Funcional

Aquí tienes una versión completa del componente `Search` refactorizado a un componente de función.

```tsx
import { useState, useEffect, FC } from "react";
import { useHistory, useLocation, RouteComponentProps } from "react-router-dom";
import SearchContext, {
  drawControlHandler,
  srchType,
} from "pages/search/SearchContext";
import SearchAPI from "pages/search/utils/searchAPI";
import { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import { isUndefinedOrNull } from "utils/validations";
import MapViewer from "pages/search/MapViewer";
import GeoServerAPI from "utils/geoServerAPI";
import Dashboard from "pages/search/Dashboard";
import Selector from "pages/search/Selector";
import { MapTitle, rasterLayer, shapeLayer } from "pages/search/types/layers";
import matchColor from "pages/search/utils/matchColor";
import { GeoJsonObject } from "geojson";
import L, { LatLngBoundsExpression } from "leaflet";
import { Names } from "types/layoutTypes";
import { hasInvalidGeoJson } from "pages/search/utils/GeoJsonUtils";

interface Props extends RouteComponentProps {
  areaType?: string;
  areaId?: number | string;
  setHeaderNames: React.Dispatch<React.SetStateAction<Names>>;
}

export const Search: FC<Props> = (props) => {
  const history = useHistory();

  const [searchType, setSearchType] = useState<srchType>("definedArea");
  const [areaLayer, setAreaLayerState] = useState<shapeLayer>({ id: "", paneLevel: 0, json: { type: "FeatureCollection" } });
  const [rasterLayers, setRasterLayers] = useState<Array<rasterLayer>>([]);
  const [shapeLayers, setShapeLayers] = useState<Array<shapeLayer>>([]);
  const [showAreaLayer, setShowAreaLayer] = useState<boolean>(false);
  const [bounds, setBounds] = useState<LatLngBoundsExpression>([]);
  const [mapTitle, setMapTitle] = useState<MapTitle>({ name: "" });
  const [loadingLayer, setLoadingLayer] = useState<boolean>(false);
  const [layerError, setLayerError] = useState<boolean>(false);
  const [showDrawControl, setShowDrawControl] = useState<boolean>(true);
  const [onEditControlMounted, setOnEditControlMounted] = useState<drawControlHandler>(() => {});
  const [areaType, setAreaTypeState] = useState<AreaType | undefined>();
  const [areaId, setAreaIdState] = useState<AreaIdBasic | undefined>();
  const [areaHa, setAreaHa] = useState<number | undefined>();

  const setAreaLayer = (layerJson?: GeoJsonObject) => {
    if (layerJson) {
      const bounds = L.geoJSON(layerJson).getBounds();
      const newAreaLayer = {
        id: "geofence",
        paneLevel: 1,
        json: layerJson,
        layerStyle: () => ({
          stroke: false,
          fillColor: matchColor("geofence")(),
          fillOpacity: 0.6,
        }),
      };
      setAreaLayerState(newAreaLayer);
      setBounds(bounds);
    } else {
      setAreaLayerState({
        id: "",
        paneLevel: 0,
        json: { type: "FeatureCollection" },
      });
      setBounds([]);
    }
  };

  useEffect(() => {
    const { areaType: areaTypeParam, areaId: areaIdParam, setHeaderNames } = props;
    if (!isUndefinedOrNull(areaTypeParam) && !isUndefinedOrNull(areaIdParam)) {
      Promise.all([
        SearchAPI.requestAreaTypes(),
        SearchAPI.requestAreaIds(areaTypeParam!),
        SearchAPI.requestAreaInfo(areaIdParam!),
      ]).then(([types, ids, areaIdInfo]) => {
        const typeObj = types.find(({ id }) => id === areaTypeParam);
        const idObj = ids.find(({ id }) => id === areaIdInfo.id);

        setAreaTypeState(typeObj);
        setAreaIdState(idObj);
        setAreaHa(Number(areaIdInfo.area));
        setHeaderNames({ parent: idObj!.name, child: typeObj!.label });
        setAreaLayer(areaIdInfo.geometry);
      });
    }
  }, [props.areaType, props.areaId, props.setHeaderNames]);

  const setAreaType = (newAreaType?: AreaType) => {
    setAreaTypeState(newAreaType);
    if (newAreaType) {
      history.push(`?area_type=${newAreaType!.id}`);
    }
  };

  const setAreaId = (newAreaId?: AreaIdBasic) => {
    setAreaIdState(newAreaId);
    if (newAreaId && areaType) {
      props.setHeaderNames({
        parent: areaType!.label,
        child: newAreaId!.name,
      });
      history.push(`?area_type=${areaType!.id}&area_id=${newAreaId!.id}`);
    }
  };

  const setLayerErrorFunc = (error?: string) => {
    setLayerError(!!error);
  };

  const clearLayers = () => {
    setShapeLayers([]);
    setRasterLayers([]);
    setLoadingLayer(false);
    setLayerErrorFunc();
    setMapTitle({ name: "" });
    setShowAreaLayer(false);
  };

  const handlerBackButton = () => {
    setAreaIdState(undefined);
    setAreaTypeState(undefined);
    setAreaHa(undefined);
    setSearchType("definedArea");
    setAreaLayerState({ id: "", paneLevel: 0, json: { type: "FeatureCollection" } });
    setRasterLayers([]);
    setShapeLayers([]);
    setBounds([]);
    setMapTitle({ name: "" });
    setShowAreaLayer(false);
    setLoadingLayer(false);
    setLayerError(false);
    props.setHeaderNames({ parent: "", child: "" });
    history.replace(history.location.pathname);
  };

  const setShapeLayersFunc = (layers: Array<shapeLayer>) => {
    if (!hasInvalidGeoJson(layers)) setShapeLayers(layers);
  };

  let toShow = <Selector setShowDrawControl={setShowDrawControl} />;
  if (
    !isUndefinedOrNull(searchType) &&
    !isUndefinedOrNull(areaType) &&
    !isUndefinedOrNull(areaId) &&
    !isUndefinedOrNull(areaLayer) &&
    !isUndefinedOrNull(areaHa)
  ) {
    toShow = <Dashboard handlerBackButton={handlerBackButton} />;
  }

  return (
    <SearchContext.Provider
      value={{
        searchType: searchType ?? "definedArea",
        areaType: areaType,
        areaId: areaId,
        areaHa: areaHa,
        setSearchType: setSearchType,
        setAreaType: setAreaType,
        setAreaId: setAreaId,
        setAreaHa: setAreaHa,
        setAreaLayer: setAreaLayer,
        setRasterLayers: setRasterLayers,
        setShapeLayers: setShapeLayersFunc,
        setShowAreaLayer: setShowAreaLayer,
        setLoadingLayer: setLoadingLayer,
        setLayerError: setLayerErrorFunc,
        setMapTitle: setMapTitle,
        clearLayers: clearLayers,
        onEditControlMounted: onEditControlMounted,
        setOnEditControlMounted: setOnEditControlMounted,
      }}
    >
      <div className="appSearcher wrappergrid">
        <MapViewer
          geoServerUrl={GeoServerAPI.getRequestURL()}
          loadingLayer={loadingLayer}
          layerError={layerError}
          shapeLayers={
            showAreaLayer
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
};
```

## Consideraciones Adicionales

*   **Props:** El componente funcional recibirá `props` como su primer argumento. Ya no se accederá a ellas a través de `this.props`.
*   **Tipado:** Asegúrate de que el tipado de las props y los estados sea correcto. En el ejemplo anterior, se utiliza `FC<Props>` para tipar el componente.
*   **Linter y Formateador:** Después de la migración, ejecuta las herramientas de linting y formateo del proyecto para asegurar que el nuevo código sigue las convenciones del proyecto.

Con estos pasos, el componente `Search` estará completamente migrado a un componente de función, listo para futuras actualizaciones y con un código más limpio y mantenible.
