import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronRightCircle,
  RotateCcw,
  SearchIcon,
  XCircle,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";
import { StrValidator } from "@utils/strValidator";
import { cn } from "@ui/shadCN/lib/utils";
import { makeInitiativeLocationsString } from "@utils/format";

import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { fuzzySearch } from "pages/monitoring/utils/search";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { uiText } from "./layout/uiText";

export function InitiativesSearch({
  currentInitiative,
  setCurrentInitiative,
}: {
  currentInitiative: InitiativeByLocation | null;
  setCurrentInitiative: Dispatch<SetStateAction<InitiativeByLocation | null>>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [initiativesFilterInput, setInitiativesFilterInput] = useState("");

  useEffect(() => {
    const fetchInitiativesAvailable = async () => {
      const res = await getInitiativeLocations();
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setInitiatives(res);
    };

    void fetchInitiativesAvailable();
  }, []);

  const filteredInitiatives = useMemo(() => {
    const sanitizedSearch = StrValidator.normalize(initiativesFilterInput);

    if (!sanitizedSearch) {
      return initiatives;
    }

    return initiatives.filter(
      (i) =>
        currentInitiative?.id === i.id ||
        fuzzySearch(sanitizedSearch, StrValidator.normalize(i.name)),
    );
  }, [initiativesFilterInput, initiatives, currentInitiative?.id]);

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <div className="space-y-2">
      <div
        aria-label={uiText.initiativeSearch.sectionLabel}
        className="bg-input p-4 rounded-lg flex gap-2"
      >
        <InputGroup>
          <InputGroupInput
            id="filterInitiatives"
            value={initiativesFilterInput}
            onChange={(e) => setInitiativesFilterInput(e.target.value)}
            placeholder={uiText.initiativeSearch.input.placeholder}
            autoComplete="off"
          />
          <InputGroupAddon align="inline-end">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <Button
          variant="outline"
          disabled={initiativesFilterInput.length === 0}
          title={uiText.initiativeSearch.input.restartBtn.title}
          size="icon"
          aria-label={uiText.initiativeSearch.input.restartBtn.sr}
          onClick={() => setInitiativesFilterInput("")}
        >
          <RotateCcw />
          {uiText.initiativeSearch.input.restartBtn.label}
        </Button>
      </div>

      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 p-4 border border-accent rounded-lg"
      />

      <div className="overflow-y-auto min-h-0 h-full max-h-[300px] lg:max-h-none scrollbar-custom">
        {filteredInitiatives.map((initiative) => {
          const isActive = currentInitiative?.id === initiative.id;

          return (
            <div
              key={initiative.id}
              className={cn(
                "p-4 rounded-lg flex items-center gap-2 border border-transparent",
                "hover:border-primary transition-colors duration-300 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-primary hover:bg-primary/10",
              )}
            >
              <div className="flex-1">
                <h4 className="text-xl m-0">{initiative.name}</h4>
                <span className="m-0 text-sm m-0 truncate min-w-0">
                  {makeInitiativeLocationsString(initiative.locations)}
                </span>
              </div>

              {!isActive ? (
                <Button
                  onClick={() => {
                    setCurrentInitiative(initiative);
                  }}
                  variant="ghost"
                  size="icon-lg"
                  title={uiText.initiativeSearch.selectInitiativeBtn.title}
                  aria-label={uiText.initiativeSearch.selectInitiativeBtn.sr}
                >
                  {uiText.initiativeSearch.selectInitiativeBtn.label}
                  <ChevronRightCircle className="size-8" strokeWidth={1.5} />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentInitiative(null);
                  }}
                  variant="ghost"
                  size="icon-lg"
                  className="text-primary-foreground"
                  title={uiText.initiativeSearch.deselectInitiativeBtn.title}
                  aria-label={uiText.initiativeSearch.deselectInitiativeBtn.sr}
                >
                  {uiText.initiativeSearch.deselectInitiativeBtn.label}
                  <XCircle className="size-8" strokeWidth={1.5} />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
