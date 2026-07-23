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
import { uiText } from "./layout/uiText";

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
      className="w-full p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${indicatorsSearchBkg})` }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="w-full lg:w-[60%] lg:max-w-[600px] rounded-xl outline-2 -outline-offset-1 overflow-hidden outline-primary">
          <h3 className="bg-primary text-primary-foreground p-4 py-2 m-0 font-normal">
            {uiText.searchInput.title}
          </h3>
          <form
            onReset={handleReset}
            className="flex flex-col gap-2 p-4 bg-primary/70 backdrop-blur-sm"
          >
            <div>
              <label
                htmlFor="searchIndicator"
                className="text-primary-foreground font-normal"
              >
                {uiText.searchInput.indicatorSearch.label}
              </label>
              <InputGroup>
                <InputGroupInput
                  id="searchIndicator"
                  type="text"
                  value={searchIndicator}
                  onChange={(e) => setSearchIndicator(e.target.value)}
                  className="placeholder:text-foreground"
                  placeholder={uiText.searchInput.indicatorSearch.placeholder}
                />
                <InputGroupAddon align="inline-end">
                  <SearchIcon className="text-accent" />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div>
              <label
                htmlFor="InitiativeSearchfield"
                className="text-primary-foreground font-normal"
              >
                {uiText.searchInput.initiativeFilter.label}
              </label>
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
                uiText={uiText.searchInput.initiativeFilter.comboboxText}
                className="[&_svg]:text-accent"
              />
            </div>

            <div className="flex *:flex-1 gap-2">
              <div>
                <label
                  htmlFor="ecosystemTagFilter"
                  className="text-primary-foreground font-normal"
                >
                  {uiText.searchInput.ecosystemFilter.label}
                </label>
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
                  uiText={uiText.searchInput.ecosystemFilter.comboboxText}
                  fixedFilter="category/id eq 4"
                  className="flex-1 [&_svg]:text-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="biologicalGroupTagFilter"
                  className="text-primary-foreground font-normal"
                >
                  {uiText.searchInput.biologicalGroupFilter.label}
                </label>
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
                  uiText={uiText.searchInput.biologicalGroupFilter.comboboxText}
                  fixedFilter="category/id eq 3"
                  className="flex-1 [&_svg]:text-accent"
                />
              </div>
            </div>

            <div className="flex *:flex-1 gap-2">
              <div>
                <label
                  htmlFor="departmentFilter"
                  className="text-primary-foreground font-normal"
                >
                  {uiText.searchInput.departmentFilter.label}
                </label>
                <Combobox
                  id="departmentFilter"
                  items={departments}
                  value={filterDepartment}
                  setValue={setFilterDepartment}
                  keys={{ forLabel: "name", forValue: "value" }}
                  uiText={uiText.searchInput.departmentFilter.comboboxText}
                  className="[&_svg]:text-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="yearFilter"
                  className="text-primary-foreground font-normal"
                >
                  {uiText.searchInput.yearFilter.label}
                </label>
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger
                    id="yearFilter"
                    className="bg-background [&_svg]:text-accent data-placeholder:text-foreground data-placeholder:texr-base"
                  >
                    <SelectValue
                      placeholder={uiText.searchInput.yearFilter.placeholder}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {filterYear !== "" && (
                      <SelectItem value="" className="text-muted-foreground">
                        {uiText.searchInput.yearFilter.removeSelection}
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
              </div>
            </div>

            <Button
              type="reset"
              className="self-end"
              variant="outline_destructive"
              title={uiText.searchInput.resetSearch.title}
              aria-label={uiText.searchInput.resetSearch.sr}
            >
              <Trash2 />
              {uiText.searchInput.resetSearch.label}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
