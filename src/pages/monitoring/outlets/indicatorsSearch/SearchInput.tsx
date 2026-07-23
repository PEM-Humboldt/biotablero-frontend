import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import indicatorsSearchBkg from "@assets/indicatorsSearchBKG.jpg";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon, Trash2 } from "lucide-react";
import { debouncer } from "@utils/debouncer";
import { StableComboboxOData } from "@ui/ComboboxOData";
import type {
  ODataInitiativeShort,
  ODataTag,
} from "pages/monitoring/types/odataResponse";
import { Combobox } from "@ui/ComboBox";
import { getColombianDepartments } from "pages/monitoring/utils/manageLocation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadCN/component/select";
import { Button } from "@ui/shadCN/component/button";
import { MONITORING_YEARS_AVAILABLE } from "@config/monitoring";

export function SearchInput() {
  const { setSearchIndicators } = useIndicatorsCTX();
  const debouncedSearch = useRef(debouncer(setSearchIndicators)).current;

  const [searchIndicator, setSearchIndicator] = useState("");
  const [filterInitiative, setFilterInitiative] = useState("");
  const [filterEcosystem, setFilterEcosystem] = useState("");
  const [filterBiologicalGroup, setFilterBiologicalGroup] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [departments, setDepartments] = useState<
    { value: number; name: string }[]
  >([]);

  useEffect(() => {
    const fetchColombianDepartments = async () => {
      const res = await getColombianDepartments();
      setDepartments(res);
    };

    void fetchColombianDepartments();
  }, []);

  const searchFilter = useMemo(() => {
    const lower = searchIndicator.toLocaleLowerCase();

    const filterMap = {
      [searchIndicator]: `contains(tolower(name), '${lower}') or contains(tolower(type/name), '${lower}')`,
      [filterInitiative]: `initiativeId eq ${filterInitiative}`,
      [filterEcosystem]: `IndicatorTags/any(l: l/tag/id eq ${filterEcosystem})`,
      [filterBiologicalGroup]: `IndicatorTags/any(l: l/tag/id eq ${filterBiologicalGroup})`,
      [filterDepartment]: `IndicatorLocations/any(l: l/location/parent/id eq ${filterDepartment})`,
      [filterYear]: `Versions/any(l: year(l/creationDate) eq ${filterYear})`,
    };

    return Object.entries(filterMap).reduce((filter, [value, query]) => {
      if (!value) {
        return filter;
      }
      return filter ? `${filter} and ${query}` : query;
    }, "");
  }, [
    searchIndicator,
    filterInitiative,
    filterEcosystem,
    filterBiologicalGroup,
    filterDepartment,
    filterYear,
  ]);

  useEffect(() => {
    debouncedSearch((old) => ({ ...old, filter: searchFilter }));
  }, [searchFilter]);

  const handleReset = () => {
    setSearchIndicator("");
    setFilterInitiative("");
    setFilterEcosystem("");
    setFilterBiologicalGroup("");
    setFilterDepartment("");
    setFilterYear("");
  };

  return (
    <header
      className="w-full p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${indicatorsSearchBkg})` }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="w-full lg:w-[60%] lg:max-w-[600px] rounded-xl outline-2 -outline-offset-1 overflow-hidden outline-primary">
          <h3 className="bg-primary text-primary-foreground p-4 py-2 m-0 font-normal">
            Encuentra un indicador
          </h3>
          <form
            onReset={handleReset}
            className="flex flex-col gap-3 p-4 bg-primary/70 backdrop-blur-sm"
          >
            <InputGroup>
              <InputGroupInput
                type="text"
                value={searchIndicator}
                onChange={(e) => setSearchIndicator(e.target.value)}
                className="placeholder:text-foreground"
                placeholder="Excribe una palabra clave"
              />
              <InputGroupAddon align="inline-end">
                <SearchIcon className="text-accent" />
              </InputGroupAddon>
            </InputGroup>

            <StableComboboxOData<ODataInitiativeShort>
              id="InitiativeSearchfield"
              value={filterInitiative}
              setValue={setFilterInitiative}
              endpoint="Initiative"
              sources={["name"]}
              sourceProcess={(items) =>
                items.map((i) => ({ value: String(i.id), label: i.name }))
              }
              maxItems={4}
              uiText={{
                itemNotFound: "No se encontraron iniciativas",
                trigger: "Filtrar por iniciativa",
                inputPlaceholder: "Buscar la iniciativa",
              }}
              className="[&_svg]:text-accent"
            />

            <div className="flex gap-2">
              <StableComboboxOData<ODataTag>
                id="ecosystemTagFilter"
                value={filterEcosystem}
                setValue={setFilterEcosystem}
                endpoint="Tag"
                sources={["name"]}
                sourceProcess={(items) =>
                  items.map((i) => ({ value: String(i.id), label: i.name }))
                }
                maxItems={4}
                uiText={{
                  itemNotFound: "Sin resultados",
                  trigger: "¿Qué ecosistema buscas?",
                  inputPlaceholder: "Buscar ecosistema estratégico",
                }}
                fixedFilter="category/id eq 4"
                className="flex-1 [&_svg]:text-accent"
              />

              <StableComboboxOData<ODataTag>
                id="biologicalGroupTagFilter"
                value={filterBiologicalGroup}
                setValue={setFilterBiologicalGroup}
                endpoint="Tag"
                sources={["name"]}
                sourceProcess={(items) =>
                  items.map((i) => ({ value: String(i.id), label: i.name }))
                }
                maxItems={4}
                uiText={{
                  itemNotFound: "Sin resultados",
                  trigger: "¿Qué escala biológica?",
                  inputPlaceholder: "Buscar la escala biológica",
                }}
                fixedFilter="category/id eq 3"
                className="flex-1 [&_svg]:text-accent"
              />
            </div>

            <Combobox
              items={departments}
              value={filterDepartment}
              setValue={setFilterDepartment}
              keys={{ forLabel: "name", forValue: "value" }}
              uiText={{
                itemNotFound: "",
                trigger: "Selecciona un departamento",
                inputPlaceholder: "Buscar un departamento",
              }}
              className="[&_svg]:text-accent"
            />

            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="bg-background [&_svg]:text-accent data-placeholder:text-foreground data-placeholder:texr-base">
                <SelectValue placeholder="Selecciona un año de inicio" />
              </SelectTrigger>

              <SelectContent>
                {filterYear !== "" && (
                  <SelectItem value="" className="text-muted-foreground">
                    Borrar seleccion
                  </SelectItem>
                )}
                {MONITORING_YEARS_AVAILABLE.map((year) => (
                  <SelectItem
                    key={`indicatorYear_${year}`}
                    value={String(year)}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="reset"
              className="self-end"
              variant="outline_destructive"
            >
              <Trash2 />
              Borrar filtros
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
