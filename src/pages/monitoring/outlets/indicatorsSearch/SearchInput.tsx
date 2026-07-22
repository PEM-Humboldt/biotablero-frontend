import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import indicatorsSearchBkg from "@assets/indicatorsSearchBKG.jpg";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { debouncer } from "@utils/debouncer";
import { ComboboxOData } from "@ui/ComboboxOData";
import type {
  ODataInitiativeShort,
  ODataTag,
} from "pages/monitoring/types/odataResponse";
import { Combobox } from "@ui/ComboBox";
import { getColombianDepartments } from "pages/monitoring/utils/manageLocation";

export function SearchInput() {
  const [searchIndicator, setSearchIndicator] = useState("");
  const [searchInitiative, setSearchInitiative] = useState("");
  const [filterEcosystem, setFilterEcosystem] = useState("");
  const [filterBiologicalGroup, setFilterBiologicalGroup] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [departments, setDepartments] = useState<
    { value: number; name: string }[]
  >([]);

  const { setSearchIndicators } = useIndicatorsCTX();

  const debouncedSearch = useRef(debouncer(setSearchIndicators)).current;

  useEffect(() => {
    if (searchIndicator === "") {
      return;
    }
    debouncedSearch({
      filter: `contains(tolower(name), '${searchIndicator.toLocaleLowerCase()}')`,
    });
  }, [searchIndicator]);

  useEffect(() => {
    const fetchColombianDepartments = async () => {
      const res = await getColombianDepartments();
      setDepartments(res);
    };

    void fetchColombianDepartments();
  }, []);

  return (
    <header
      className="w-full p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${indicatorsSearchBkg})` }}
    >
      <div className="max-w-[1600px] mx-auto">
        <form className="flex w-full md:w-[50%] max-w-[400px] flex-col gap-2">
          <InputGroup>
            <InputGroupInput
              type="text"
              value={searchIndicator}
              onChange={(e) => setSearchIndicator(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <ComboboxOData<ODataInitiativeShort>
            id="InitiativeSearchfield"
            value={searchInitiative}
            setValue={setSearchInitiative}
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
          />

          <ComboboxOData<ODataTag>
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
          />

          <ComboboxOData<ODataTag>
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
          />

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
          />
        </form>
      </div>
    </header>
  );
}
