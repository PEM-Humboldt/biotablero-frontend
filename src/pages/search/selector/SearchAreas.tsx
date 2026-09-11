import { Autocomplete, TextField } from "@mui/material";

import Accordion from "pages/search/Accordion";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import type { AreaIdBasic, AreaType } from "pages/search/types/dashboard";
import SearchAPI from "pages/search/api/searchAPI";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";

interface SearchAreasProps {
  areasList: Array<AreaType>;
}

function SearchAreas({ areasList }: SearchAreasProps) {
  const { areaNamesList, areaType } = useSearchStateCTX();
  const dispatchSearchMap = useSearchDispatchCTX();

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
    dispatchSearchMap({
      type: SearchUpdated.AREA_TYPE,
      areaType:
        expandedTab === ""
          ? undefined
          : { id: expandedTab, label: expandedTabLabel || expandedTab },
    });
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
}

interface AreaAutocompleteProps {
  optionsList: Array<AreaIdBasic>;
}

function AreaAutocomplete({ optionsList }: AreaAutocompleteProps) {
  const dispatchSearchMap = useSearchDispatchCTX();

  return (
    <Autocomplete
      id="autocomplete-selector"
      options={optionsList}
      getOptionLabel={(option) => option.name}
      onChange={(_, value) => {
        if (value === null) {
          dispatchSearchMap({ type: SearchUpdated.AREA_SELECTION });
        } else {
          SearchAPI.requestAreaInfo(value.id)
            .then((areaInfo) => {
              dispatchSearchMap({
                type: SearchUpdated.AREA_SELECTION,
                payload: {
                  areaId: value,
                  areaHa: Number(areaInfo.area),
                  areaLayerJSON: areaInfo.geometry,
                },
              });
            })
            .catch((err) => {
              dispatchSearchMap({
                type: SearchUpdated.LAYER_ERROR,
                layerError: err instanceof Error ? err.message : String(err),
              });
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
}

export default SearchAreas;
