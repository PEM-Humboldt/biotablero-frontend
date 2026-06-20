import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Binoculars,
  ChevronRight,
  CircleChevronLeft,
  Expand,
  Minimize2,
  PlusCircle,
} from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import { LoadingDiv } from "@ui/LoadingDiv";
import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/shadCN/component/collapsible";

import { getLocationsList } from "pages/monitoring/api/services/location";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { StatsTabs } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/StatsTabs";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import type { IndicatorMetadata } from "pages/monitoring/types/indicators";
import { getIndicatorsByInitiative } from "pages/monitoring/api/services/indicators";
import { DataSheetSmallCard } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/DataSheetSmallCard";

export function DataSheetAndNavigation({
  initiatives,
}: {
  initiatives: InitiativeByLocation[];
}) {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Record<number, string>>({});
  const { departmentId, initiativeId } = useParams();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const locationList = await getLocationsList();
      if (isMonitoringAPIError(locationList)) {
        return {};
      }
      setLocations(
        locationList.reduce<Record<number, string>>((all, current) => {
          all[current.id] = current.name;
          return all;
        }, {}),
      );
    };

    void fetchLocations();
  }, []);

  const currentInitiative = useMemo(() => {
    const foundInitiative = initiatives.find(
      (i) => i.initiativeId === Number(initiativeId),
    );

    return foundInitiative ?? null;
  }, [initiativeId, initiatives]);

  const { statsScope, title } = useMemo(() => {
    if (currentInitiative) {
      const scope = currentInitiative.initiativeName;
      return {
        statsScope: scope,
        title: `Cifras generales de la iniciativa ${scope}`,
      };
    }

    if (departmentId) {
      const scope = locations[Number(departmentId)] ?? "";
      return {
        statsScope: scope,
        title: `Cifras generales de ${scope}`,
      };
    }

    return {
      statsScope: "Colombia",
      title: "Cifras generales",
    };
  }, [departmentId, currentInitiative, locations]);

  return (
    <div className="absolute w-full md:w-[40%] max-w-[450px] top-4 left-4 z-10 rounded-lg shadow-md">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <header className="bg-primary px-4 h-12 border border-primary/50 border-b-0 rounded-t-lg flex gap-2 justify-between items-center">
          <h4
            className="uppercase text-primary-foreground mb-0"
            aria-label={title}
          >
            Cifras generales
          </h4>
          <div className="space-x-2">
            {(departmentId || initiativeId) && (
              <Button
                className="p-0 text-primary-foreground"
                onClick={() =>
                  void navigate(
                    initiativeId
                      ? `/Monitoreo/Departamento/${departmentId}`
                      : "/Monitoreo",
                  )
                }
                variant="link"
                size="icon"
                title={
                  initiativeId ? "Volver al departamento" : "Volver al país"
                }
              >
                <CircleChevronLeft className="size-6" />
              </Button>
            )}

            <CollapsibleTrigger asChild>
              <Button
                className="p-0 text-primary-foreground"
                variant="link"
                size="icon"
                title={expanded ? "Contraer" : "expandir"}
              >
                {expanded ? (
                  <Minimize2 className="size-6" />
                ) : (
                  <Expand className="size-6" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </header>

        <div className="bg-background flex flex-col items-start border border-primary/50 border-t-0 rounded-b-lg p-4 pt-2">
          <div
            className="text-xl w-full m-0 border-b border-b-muted"
            aria-hidden="true"
          >
            {statsScope}
          </div>

          <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
            {initiativeId && (
              <Button
                onClick={() =>
                  void navigate(`/Monitoreo/Iniciativas/${initiativeId}`)
                }
                size="sm"
                variant="outline"
                className="mt-1"
              >
                Ir a la iniciativa
                <ChevronRight />
              </Button>
            )}

            <StatsTabs />
          </CollapsibleContent>
        </div>

        <CardsAttachment />
      </Collapsible>
    </div>
  );
}

function CardsAttachment() {
  const { departmentId, initiativeId } = useParams();
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [indicators, setIndicators] = useState<IndicatorMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchInitiatives = async () => {
      if (!departmentId) {
        setInitiatives([]);
        return;
      }

      setIsLoading(true);
      const res = await getInitiativeLocations(Number(departmentId));

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        setInitiatives([]);
        return;
      }

      setInitiatives(res);
    };

    void fetchInitiatives();
  }, [departmentId]);

  useEffect(() => {
    const fetchIndicators = async () => {
      if (!initiativeId) {
        setIndicators([]);
        return;
      }

      setIsLoading(true);
      const res = await getIndicatorsByInitiative(Number(initiativeId));

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        setIndicators([]);
        return;
      }

      setIndicators(res.value);
    };

    void fetchIndicators();
  }, [initiativeId]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!departmentId}
      inert={!departmentId ? "" : undefined}
      className={cn(
        "absolute w-[300px] top-12 -right-2 translate-x-full rounded-lg shadow-2xl",
        "transition-all duration-300 ease-in-out",
        !departmentId
          ? "-translate-y-100 opacity-0 pointer-events-none"
          : " translate-y-0  opacity-100",
      )}
    >
      {isLoading ? (
        <LoadingDiv />
      ) : (
        <>
          <ErrorsList errorItems={errors} />
          <Collapsible open={expanded} onOpenChange={setExpanded}>
            <section>
              <div
                className={cn(
                  "flex gap-2 justify-between bg-primary transition-all duration-300 text-primary-foreground p-2 rounded-t-lg border border-primary/50",
                  expanded ? "" : "rounded-b-lg",
                )}
              >
                <h4 className="flex gap-2 items-center text-lg m-0">
                  <Binoculars
                    className="size-5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {initiativeId ? "Indicadores" : "Iniciativas"}
                </h4>

                <CollapsibleTrigger asChild>
                  <Button
                    className="p-0 text-primary-foreground"
                    variant="link"
                    size="icon-sm"
                    title={expanded ? "Contraer" : "expandir"}
                  >
                    {expanded ? (
                      <Minimize2 className="size-5" />
                    ) : (
                      <Expand className="size-5" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <div className="bg-grey-light rounded-b-lg p-3 space-y-3 border border-primary/50 max-h-[500px] h-auto overflow-y-auto scrollbar-custom">
                  {!initiativeId &&
                    initiatives.length > 0 &&
                    initiatives.map((initiative) => (
                      <DataSheetSmallCard
                        key={`initiativesSmallCard_${initiative.initiativeName}`}
                        title={initiative.initiativeName}
                        tags={(initiative.tags ?? []).map((t) => t.tag)}
                        bottonLeftInfo={
                          initiative.creationDate
                            ? new Date(initiative.creationDate)
                            : new Date()
                        }
                        link={{
                          href: `/Monitoreo/Departamento/${departmentId}/${initiative.initiativeId}`,
                          label: "Ver",
                          icon: PlusCircle,
                          title: "Ver más información",
                        }}
                      />
                    ))}

                  {initiativeId &&
                    indicators.length > 0 &&
                    indicators.map((indicator) => (
                      <DataSheetSmallCard
                        key={`indicatorsSmallCard_${indicator.id}`}
                        title={indicator.type.name}
                        tags={indicator.tags.map((t) => t.tag)}
                        bottonLeftInfo={`Version: ${indicator.versions[0].version}`}
                        link={{
                          href: `/Monitoreo/Indicadores/${indicator.id}`,
                          label: "Ir",
                          icon: ChevronRight,
                          title: "Ir al indicador",
                        }}
                      />
                    ))}

                  {initiatives.length === 0 && indicators.length === 0 && (
                    <div className="bg-primary/10 border border-primary rounded-lg text-xl font-normal text-center text-primary p-4">
                      No hay informacion disponible
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>
        </>
      )}
    </div>
  );
}
