import { useContext, useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";

import Accordion from "pages/search/Accordion";
import DrawPolygon from "pages/search/selector/DrawPolygon";

import isFlagEnabled from "utils/isFlagEnabled";
import {
  ErrorMessage,
  LoadingMessage,
} from "pages/search/selector/selectorMessages";
import SearchAPI from "utils/searchAPI";
import { AreaIdBasic, AreaType } from "./types/dashboard";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import { Autocomplete, TextField } from "@mui/material";
import isUndefinedOrNull from "utils/validations";
import GeoJsonUtils from "utils/GeoJsonUtils";

const Selector = () => {
  const [drawPolygonFlag, setDrawPolygonFlag] = useState(true);
  const [areaTypes, setAreaTypes] = useState<Array<AreaType>>([]);
  const [areasError, setAreasError] = useState(false);
  const [polygonError, setPolygonError] = useState(false);

  const context = useContext(SearchContext);
  const { setSearchType, setAreaHa, setAreaId, setAreaType, setAreaLayer } =
    context as SearchContextValues;

  useEffect(() => {
    isFlagEnabled("drawPolygon").then((value) => setDrawPolygonFlag(value));
    SearchAPI.requestAreaTypes()
      .then((result) => setAreaTypes(result))
      .catch(() => setAreasError(true));

    SearchAPI.requestTestBackend().catch(() => setPolygonError(true));
  }, []);

  const sections = [
    {
      label: {
        id: "panel1-Geocerca",
        name: "Área de consulta",
      },
      component: areasError
        ? ErrorMessage
        : areaTypes.length < 1
        ? LoadingMessage
        : SearchAreas,
      componentProps: {
        areasList: areaTypes,
      },
      collapsed: false,
    },
    {
      label: {
        id: "draw-polygon",
        name: "Dibujar polígono",
        icon: EditIcon,
        disabled: !drawPolygonFlag,
      },
      // TODO: Considerar move DrawPolygon aquí mismo o mover SearchAreas a otro archivo
      component: polygonError ? ErrorMessage : DrawPolygon,
    },
    {
      label: {
        id: "panel3",
        name: "Subir polígono",
        disabled: true,
      },
    },
  ];

  const onChange = (lvl: string, expTab: string) => {
    if (expTab === "panel1-Geocerca") {
      setSearchType("definedArea");
    } else if (expTab === "draw-polygon") {
      setSearchType("drawPolygon");
    } else {
      setSearchType(null);
    }
    setAreaHa();
    setAreaId();
    setAreaType();
    setAreaLayer();
  };

  return (
    <div className="selector">
      <div className="description">
        <p>
          En esta sección podrás encontrar información sobre{" "}
          <b> ecosistemas </b>,<b>especies</b> y <b>paisaje</b>, de 3 distintas
          maneras:
        </p>
        <p>
          <i>1</i> Selecciona un <b>área de consulta</b> predeterminada
          (departamentos, jurisdicciones, etc.)
        </p>
        <p>
          <i>2</i> Dibuja un <b>polígono</b>
        </p>
        <p>
          <i>3</i> Sube tu propio <b>polígono</b> (usuarios registrados)
        </p>
      </div>
      <Accordion
        componentsArray={sections}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        level="1"
        handleChange={onChange}
      />
    </div>
  );
};

interface SearchAreasProps {
  areasList: Array<AreaType>;
}
const SearchAreas: React.FunctionComponent<SearchAreasProps> = ({
  areasList,
}) => {
  const [areasId, setAreasId] = useState<Array<AreaIdBasic>>([]);
  const context = useContext(SearchContext);
  const { areaType, setAreaType } = context as SearchContextValues;

  useEffect(() => {
    if (!isUndefinedOrNull(areaType)) {
      SearchAPI.requestAreaIds(areaType!.id).then((areas) => setAreasId(areas));
    }
  }, []);

  const components = areasList
    .filter((area) => area.id !== "custom")
    .map((area) => ({
      label: {
        id: area.id,
        name: area.label,
        disabled: area.id === "se",
        collapsed: areaType?.id !== area.id,
      },
      component: AreaAutocomplete,
      componentProps: {
        optionsList: areasId,
      },
    }));

  const onChange = (
    level: string,
    expandedTab: string,
    expandedTabLabel?: string
  ) => {
    if (expandedTab === "") {
      setAreaType();
    } else {
      setAreaType({ id: expandedTab, label: expandedTabLabel || expandedTab });
      SearchAPI.requestAreaIds(expandedTab).then((areas) => setAreasId(areas));
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Accordion
        componentsArray={components}
        classNameDefault="m0"
        classNameSelected="m0"
        level="2"
        handleChange={onChange}
      />
    </div>
  );
};

interface AreaAutocompleteProps {
  optionsList: Array<AreaIdBasic>;
}

const AreaAutocomplete: React.FunctionComponent<AreaAutocompleteProps> = ({
  optionsList,
}) => {
  const context = useContext(SearchContext);
  const { areaType, setAreaId, setAreaLayer, setAreaHa } =
    context as SearchContextValues;

  return (
    <Autocomplete
      id="autocomplete-selector"
      options={optionsList}
      getOptionLabel={(option) => option.name}
      onChange={(event, value) => {
        if (isUndefinedOrNull(value)) {
          setAreaId();
          setAreaLayer();
          setAreaHa();
        } else {
          setAreaId(value || undefined);
          // TODO: Agregar manejo de peticiones, para que si se desmonta el componente se cancelen las peticiones activas
          Promise.all([SearchAPI.requestAreaInfo(value?.id!)]).then(
            ([areaId]) => {
              setAreaHa(Number(areaId.area));
              setAreaLayer(GeoJsonUtils.castAreaIdToFeatureCollection(areaId));
            }
          );
        }
      }}
      style={{ width: "100%" }}
      renderInput={(params) => (
        <TextField
          InputProps={params.InputProps}
          inputProps={params.inputProps}
          fullWidth={params.fullWidth}
          label="Escriba el nombre a buscar"
          placeholder="Seleccionar..."
          variant="standard"
          InputLabelProps={{ shrink: true }}
        />
      )}
      renderOption={(props, option) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <li {...props} key={option.id}>
          {option.name}
        </li>
      )}
      autoHighlight
      ListboxProps={{
        style: {
          maxHeight: "100px",
          border: "0px",
        },
      }}
    />
  );
};

export default Selector;
