import { useMemo, useState } from "react";
import { SearchIcon, Trash2 } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadCN/component/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";

import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";
import { TopicSmallCard } from "pages/monitoring/outlets/initiatives/topics/search/TopicSmallCard";
import { fuzzySearch } from "pages/monitoring/utils/search";
import { uiText } from "pages/monitoring/outlets/initiatives/topics/layout/uiText";
import { cn } from "@ui/shadCN/lib/utils";

export function Search() {
  const { topics: allInitiativeTopics } = useTopicsCTX();
  const [lookFor, setLookFor] = useState("");
  const [biologicalGroup, setBiologicalGroup] = useState("");
  const [ecosystem, setEcosystem] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const {
    sortedTopics,
    presentBiologicalGroups,
    presentEcosystems,
    presentYears,
  } = useMemo(() => {
    const biologicalGroups: Record<number, string> = {};
    const ecosystems: Record<number, string> = {};
    const years = new Set<number>();

    const topicsWithMaxDate = allInitiativeTopics.map((topic) => {
      let maxTimestamp = 0;

      for (const v of topic.versions) {
        const dateObj = new Date(v.creationDate);
        years.add(dateObj.getFullYear());

        const time = dateObj.getTime();
        if (time > maxTimestamp) {
          maxTimestamp = time;
        }
      }

      for (const { tag } of topic.tags) {
        if (tag.category.id === 3 && !biologicalGroups[tag.id]) {
          biologicalGroups[tag.id] = tag.name;
        } else if (tag.category.id === 4 && !ecosystems[tag.id]) {
          ecosystems[tag.id] = tag.name;
        }
      }

      return { topic, maxTimestamp };
    });

    topicsWithMaxDate.sort((a, b) => b.maxTimestamp - a.maxTimestamp);

    return {
      sortedTopics: topicsWithMaxDate.map((i) => i.topic),
      presentBiologicalGroups: biologicalGroups,
      presentEcosystems: ecosystems,
      presentYears: years,
    };
  }, [allInitiativeTopics]);

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

  const filteredTopics = useMemo(() => {
    return sortedTopics.filter((topic) => {
      const sanitizedName = topic.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();

      return (
        fuzzySearch(sanitizedLookFor, sanitizedName) &&
        (!filterByBiologicalGroups ||
          topic.tags.some((tag) => tag.tag.id === Number(biologicalGroup))) &&
        (!filterByEcosystem ||
          topic.tags.some((tag) => tag.tag.id === Number(ecosystem))) &&
        (!filterByYear ||
          topic.versions.some(
            (version) =>
              new Date(version.creationDate).getFullYear() ===
              Number(selectedYear),
          ))
      );
    });
  }, [
    sortedTopics,
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

  if (allInitiativeTopics.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 border-b border-grey ",
        "md:grid-cols-2",
        "lg:grid-cols-1 lg:grid-rows-[auto_1fr] lg:max-h-full lg:border-b-0",
      )}
    >
      <div className="contents lg:block lg:sticky lg:top-2">
        <div className="bg-primary/70 rounded-xl overflow-hidden [&>div]:px-4 space-y-2">
          <h3 className="bg-primary py-2 px-4 m-0 font-normal text-primary-foreground">
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
                <SearchIcon className="text-accent" />
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
            shouldRender={Object.keys(presentBiologicalGroups).length > 0}
          />

          <FilterSelect
            {...uiText.search.module.filterEcosystem}
            value={ecosystem}
            onChange={setEcosystem}
            options={Object.entries(presentEcosystems).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            shouldRender={Object.keys(presentEcosystems).length > 0}
          />

          <FilterSelect
            {...uiText.search.module.filterYear}
            value={selectedYear}
            onChange={setSelectedYear}
            options={[...presentYears].map((y) => ({
              value: String(y),
              label: String(y),
            }))}
            shouldRender={presentYears.size > 0}
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

        <div
          className={cn(
            "flex flex-col rounded-lg max-h-100 m-0",
            "md:rounded-none md:max-h-102 md:min-h-0",
            "lg:min-h-0 lg:max-h-full",
          )}
        >
          <div className="text-primary text-sm font-normal p-2">
            {uiText.search.module.topicsAmount(
              filteredTopics.length,
              allInitiativeTopics.length,
            )}
          </div>

          <div className="flex flex-col p-2 md:p-1 gap-4 overflow-auto scrollbar-custom">
            {filteredTopics.map((topic) => (
              <TopicSmallCard
                key={`smallCartTopic_${topic.id}`}
                topic={topic}
              />
            ))}
          </div>
        </div>
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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-primary-foreground font-normal">
        {label}
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="bg-background text-foreground">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {value !== "" && (
            <SelectItem value="" className="text-muted-foreground">
              Borrar seleccion
            </SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem key={`${label}_opt_${opt.value}`} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
