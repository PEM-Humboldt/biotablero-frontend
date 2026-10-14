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
    <div aria-label="Iniciativas" className="space-y-2">
      <div
        aria-label="Filtrar por nombre"
        className="bg-input p-4 rounded-lg flex gap-2"
      >
        <InputGroup>
          <InputGroupInput
            id="filterInitiatives"
            value={initiativesFilterInput}
            onChange={(e) => setInitiativesFilterInput(e.target.value)}
            placeholder="Nombre de la iniciativa"
            autoComplete="off"
          />
          <InputGroupAddon align="inline-end">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <Button
          variant="outline"
          disabled={initiativesFilterInput.length === 0}
          title="Deshacer búsqueda"
          size="icon"
          aria-label="Deshacer búsqueda"
          onClick={() => setInitiativesFilterInput("")}
        >
          <RotateCcw />
        </Button>
      </div>

      {errors.length > 0 && <ErrorsList errorItems={errors} />}

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
                  title="Ver Observaciones de la iniciativa"
                >
                  <ChevronRightCircle className="size-8" strokeWidth={1.5} />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentInitiative(null);
                  }}
                  variant="ghost"
                  size="icon-lg"
                  title="Deseleccionat la iniciativa"
                  className="text-primary-foreground"
                >
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
