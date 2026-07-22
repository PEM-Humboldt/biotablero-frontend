import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Binoculars,
  ChartBar,
  ChevronRight,
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

import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import type { IndicatorMetadata } from "pages/monitoring/types/indicators";
import { getIndicatorsByInitiative } from "pages/monitoring/api/services/indicators";
import { DataSheetSmallCard } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/DataSheetSmallCard";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";

export function CardsAttachment() {
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
        "absolute z-10 w-74 bottom-1 left-1 lg:top-16 lg:left-112 rounded-lg shadow-2xl h-fit",
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
                  "flex gap-2 justify-between bg-primary transition-all duration-300 text-primary-foreground px-2 rounded-t-lg border border-primary/50",
                  expanded ? "" : "rounded-b-lg",
                )}
              >
                <h4 className="flex gap-2 py-1 m-0 items-center text-lg">
                  {initiativeId ? (
                    <>
                      <ChartBar
                        className="size-5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {uiText.cardsAttachment.indicators.title}
                    </>
                  ) : (
                    <>
                      <Binoculars
                        className="size-5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {uiText.cardsAttachment.initiatives.title}
                    </>
                  )}
                </h4>

                <CollapsibleTrigger asChild>
                  <Button
                    className="p-0 text-primary-foreground"
                    variant="link"
                    title={
                      expanded
                        ? uiText.windowsUiText.expandedBtn.title
                        : uiText.windowsUiText.shinkedBtn.title
                    }
                    aria-label={
                      expanded
                        ? uiText.windowsUiText.expandedBtn.sr
                        : uiText.windowsUiText.shinkedBtn.sr
                    }
                  >
                    {expanded ? (
                      <>
                        {uiText.windowsUiText.expandedBtn.label}
                        <Minimize2 />
                      </>
                    ) : (
                      <>
                        {uiText.windowsUiText.shinkedBtn.label}
                        <Expand />
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <div className="bg-grey-light rounded-b-lg p-3 space-y-3 border border-primary/50 h-auto max-h-60 lg:max-h-160 overflow-y-auto scrollbar-custom">
                  {!initiativeId &&
                    initiatives.length > 0 &&
                    initiatives.map((initiative) => {
                      const initiativeLocations =
                        initiative?.locations !== undefined
                          ? initiative.locations
                              .map((l) => {
                                const municipality =
                                  l.location.name !== null
                                    ? l.location.name
                                    : "";
                                const locallity = l.locality
                                  ? `, ${l.locality}`
                                  : "";

                                return `${municipality}${locallity}`;
                              })
                              .join(" / ")
                          : "";
                      return (
                        <DataSheetSmallCard
                          key={`initiativesSmallCard_${initiative.name}`}
                          title={initiative.name}
                          location={initiativeLocations}
                          bottonLeftInfo={
                            initiative.creationDate
                              ? new Date(initiative.creationDate)
                              : new Date()
                          }
                          link={{
                            href: `/Monitoreo/Departamento/${departmentId}/${initiative.id}`,
                            icon: PlusCircle,
                            label:
                              uiText.cardsAttachment.initiatives.gotoBtn.label,
                            title:
                              uiText.cardsAttachment.initiatives.gotoBtn.title,
                          }}
                        />
                      );
                    })}
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
                          icon: ChevronRight,
                          label:
                            uiText.cardsAttachment.indicators.gotoBtn.label,
                          title:
                            uiText.cardsAttachment.indicators.gotoBtn.title,
                        }}
                      />
                    ))}
                  {(departmentId &&
                    !initiativeId &&
                    initiatives.length === 0) ||
                    (initiativeId && indicators.length === 0 && (
                      <div className="bg-background border border-primary rounded-lg text-lg font-normal text-center text-primary p-4">
                        {uiText.cardsAttachment.noItems}
                      </div>
                    ))}
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>
        </>
      )}
    </div>
  );
}
