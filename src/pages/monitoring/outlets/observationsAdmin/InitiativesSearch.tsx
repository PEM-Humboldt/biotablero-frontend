import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import { makeInitiativeLocationsString } from "@utils/format";
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
import { fuzzySearch } from "pages/monitoring/utils/search";
import { StrValidator } from "@utils/strValidator";

export function InitiativesSearch({
  initiatives,
  currentInitiative,
  setCurrentInitiative,
}: {
  initiatives: InitiativeByLocation[];
  currentInitiative: InitiativeByLocation | null;
  setCurrentInitiative: Dispatch<SetStateAction<InitiativeByLocation | null>>;
}) {
  const [initiativesFilterInput, setInitiativesFilterInput] = useState("");

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

  return (
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
