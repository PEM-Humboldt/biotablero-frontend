import { Autocomplete, TextField } from "@mui/material";

import Accordion from "pages/search/Accordion";
import {
  useSearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import SearchAPI from "pages/search/api/searchAPI";

interface SearchAreasProps {
  areasList: Array<AreaType>;
}

const SearchAreas: React.FunctionComponent<SearchAreasProps> = ({
  areasList,
}) => {
  const context = useSearchLegacyCTX();
  const { areaNamesList, areaType, setAreaType } =
    context as LegacyContextValues;

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
        optionsList: areaNamesList,
      },
    }));

  const onChange = (
    _level: string,
    expandedTab: string,
    expandedTabLabel?: string,
  ) => {
    if (expandedTab === "") {
      setAreaType();
    } else {
      setAreaType({ id: expandedTab, label: expandedTabLabel || expandedTab });
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
  const context = useSearchLegacyCTX();
  const { setAreaId, setAreaLayer, setAreaHa } = context as LegacyContextValues;

  return (
    <Autocomplete
      id="autocomplete-selector"
      options={optionsList}
      getOptionLabel={(option) => option.name}
      onChange={(_, value) => {
        if (value === null) {
          setAreaId();
          setAreaLayer();
          setAreaHa();
        } else {
          setAreaId(value);
          // TODO: Agregar manejo de peticiones, para que si se desmonta el componente se cancelen las peticiones activas
          SearchAPI.requestAreaInfo(value.id).then((areaId) => {
            setAreaHa(Number(areaId.area));
            setAreaLayer(areaId.geometry);
          });
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

export default SearchAreas;
