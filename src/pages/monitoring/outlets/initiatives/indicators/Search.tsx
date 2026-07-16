import { useMemo, useState } from "react";
import { SearchIcon, Trash2 } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { IndicatorSmallCard } from "pages/monitoring/outlets/initiatives/indicators/search/indicatorSmallCard";
import { fuzzySearch } from "pages/monitoring/utils/search";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";

export function Search() {
  const { indicators: allInitiativeIndicators } = useIndicatorsCTX();
  const [lookFor, setLookFor] = useState("");
  const [biologicalGroup, setBiologicalGroup] = useState("");
  const [ecosystem, setEcosystem] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const {
    sortedIndicators,
    presentBiologicalGroups,
    presentEcosystems,
    presentYears,
  } = useMemo(() => {
    const biologicalGroups: Record<number, string> = {};
    const ecosystems: Record<number, string> = {};
    const years = new Set<number>();

    const indicatorsWithMaxDate = allInitiativeIndicators.map((indicator) => {
      let maxTimestamp = 0;

      for (const v of indicator.versions) {
        const dateObj = new Date(v.creationDate);
        years.add(dateObj.getFullYear());

        const time = dateObj.getTime();
        if (time > maxTimestamp) {
          maxTimestamp = time;
        }
      }

      for (const { tag } of indicator.tags) {
        if (tag.category.id === 3 && !biologicalGroups[tag.id]) {
          biologicalGroups[tag.id] = tag.name;
        } else if (tag.category.id === 4 && !ecosystems[tag.id]) {
          ecosystems[tag.id] = tag.name;
        }
      }

      return { indicator, maxTimestamp };
    });

    indicatorsWithMaxDate.sort((a, b) => b.maxTimestamp - a.maxTimestamp);

    return {
      sortedIndicators: indicatorsWithMaxDate.map((i) => i.indicator),
      presentBiologicalGroups: biologicalGroups,
      presentEcosystems: ecosystems,
      presentYears: years,
    };
  }, [allInitiativeIndicators]);

  const sanitizedLookFor = useMemo(
    () =>
      lookFor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase(),
    [lookFor],
  );

  const filterByBiologicalGroups =
    Object.keys(presentBiologicalGroups).length && biologicalGroup !== "";
  const filterByEcosystem =
    Object.keys(presentEcosystems).length && ecosystem !== "";
  const filterByYear = presentYears.size && selectedYear !== "";

  const filteredIndicators = useMemo(() => {
    return sortedIndicators.filter((indicator) => {
      const sanitizedName = indicator.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();

      return (
        fuzzySearch(sanitizedLookFor, sanitizedName) &&
        (!filterByBiologicalGroups ||
          indicator.tags.some(
            (tag) => tag.tag.id === Number(biologicalGroup),
          )) &&
        (!filterByEcosystem ||
          indicator.tags.some((tag) => tag.tag.id === Number(ecosystem))) &&
        (!filterByYear ||
          indicator.versions.some(
            (version) =>
              new Date(version.creationDate).getFullYear() ===
              Number(selectedYear),
          ))
      );
    });
  }, [
    sortedIndicators,
    sanitizedLookFor,
    filterByBiologicalGroups,
    biologicalGroup,
    filterByEcosystem,
    ecosystem,
    filterByYear,
    selectedYear,
  ]);

  const clearFilters = () => {
    setLookFor("");
    setBiologicalGroup("");
    setEcosystem("");
    setSelectedYear("");
  };

  if (allInitiativeIndicators.length === 0) {
    return null;
  }

  return (
    <div className="bg-grey-light flex-1 flex lg:min-w-76 lg:flex-col max-h-102 lg:max-h-screen">
      <div className="bg-primary/70 rounded-xl m-2 overflow-hidden [&>div]:px-4 space-y-2">
        <h3 className="bg-primary p-4 pb-2  m-0 font-normal text-primary-foreground">
          {uiText.search.module.title}
        </h3>

        <div className="pt-2">
          <label
            htmlFor="lookfor"
            className="text-primary-foreground font-normal"
          >
            {uiText.search.module.searchInputLabel}
          </label>
          <InputGroup>
            <InputGroupInput
              value={lookFor}
              onChange={(e) => setLookFor(e.target.value)}
              id="lookfor"
              autoComplete="off"
            />
            <InputGroupAddon align="inline-end">
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <FilterSelect
          {...uiText.search.module.filterBiological}
          value={biologicalGroup}
          onChange={setBiologicalGroup}
          options={Object.entries(presentBiologicalGroups).map(
            ([key, value]) => ({ value: key, label: value }),
          )}
          shouldRender={Object.keys(presentBiologicalGroups).length > 1}
        />

        <FilterSelect
          {...uiText.search.module.filterEcosystem}
          value={ecosystem}
          onChange={setEcosystem}
          options={Object.entries(presentEcosystems).map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          shouldRender={Object.keys(presentEcosystems).length > 1}
        />

        <FilterSelect
          {...uiText.search.module.filterYear}
          value={selectedYear}
          onChange={setSelectedYear}
          options={[...presentYears].map((y) => ({
            value: String(y),
            label: String(y),
          }))}
          shouldRender={presentYears.size > 1}
        />

        <div className="text-right pt-2 pb-4">
          <Button
            onClick={clearFilters}
            variant="outline_destructive"
            aria-label={uiText.search.module.resetSearchBtn.sr}
            title={uiText.search.module.resetSearchBtn.title}
          >
            <Trash2 />
            {uiText.search.module.resetSearchBtn.label}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-2 gap-4 overflow-auto scrollbar-custom">
        {filteredIndicators.map((indicator) => (
          <IndicatorSmallCard
            key={`smallCartIndicator_${indicator.id}`}
            indicator={indicator}
          />
        ))}
      </div>
    </div>
  );
}

export function FilterSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  shouldRender = true,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  shouldRender: boolean;
}) {
  if (!shouldRender) {
    return null;
  }

  const id = label.replaceAll(" ", "_");

  return (
    <div>
      <label htmlFor={id} className="text-primary-foreground font-normal">
        {label}
      </label>
      <NativeSelect
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background"
      >
        <NativeSelectOption value="">{placeholder}</NativeSelectOption>
        {options.map((opt) => (
          <NativeSelectOption key={`${id}_opt_${opt.value}`} value={opt.value}>
            {opt.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
