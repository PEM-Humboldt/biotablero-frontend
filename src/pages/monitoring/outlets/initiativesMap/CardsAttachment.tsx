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
import type { TopicMetadata } from "pages/monitoring/types/topics";
import { getTopicsByInitiative } from "pages/monitoring/api/services/topics";
import { DataSheetSmallCard } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/DataSheetSmallCard";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";
import { makeInitiativeLocationsString } from "@utils/format";

export function CardsAttachment({ className }: { className?: string }) {
  const { departmentId, initiativeId } = useParams();
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [topics, setTopics] = useState<TopicMetadata[]>([]);
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
    const fetchTopics = async () => {
      if (!initiativeId) {
        setTopics([]);
        return;
      }

      setIsLoading(true);
      const res = await getTopicsByInitiative(Number(initiativeId));

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        setTopics([]);
        return;
      }

      setTopics(res);
    };

    void fetchTopics();
  }, [initiativeId]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!departmentId}
      // NOTE: para que no sea accesible al teclado cuando está oculto
      {...(!departmentId ? { inert: "" } : {})}
      className={className}
    >
      {isLoading ? (
        <LoadingDiv />
      ) : (
        <>
          <Collapsible open={expanded} onOpenChange={setExpanded}>
            <section>
              <div
                className={cn(
                  "flex gap-2 justify-between bg-primary transition-all duration-300 text-primary-foreground px-4 h-12 xl:h-auto! xl:px-2",
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
                      {uiText.cardsAttachment.topics.title}
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
                    className="hidden xl:inline-flex! p-0 text-primary-foreground"
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
                <div className="bg-grey-light p-3 space-y-3 lg:h-130 xl:h-auto max-h-160 overflow-y-auto scrollbar-custom">
                  <ErrorsList
                    errorItems={errors}
                    className="bg-accent/10 p-2 rounded-lg border border-accent"
                  />

                  {!initiativeId &&
                    initiatives.length > 0 &&
                    initiatives.map((initiative) => {
                      const initiativeLocations =
                        initiative?.locations !== undefined
                          ? makeInitiativeLocationsString(
                              initiative.locations,
                              " / ",
                            )
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
                    topics.length > 0 &&
                    topics.map((topic) => {
                      return (
                        <DataSheetSmallCard
                          key={`topicSmallCard_${topic.id}`}
                          title={topic.topicType.name}
                          tags={topic.tags.map((t) => t.tag)}
                          bottonLeftInfo={
                            topic.versions[topic.versions.length - 1]
                          }
                          link={{
                            href: `/Monitoreo/Iniciativas/${topic.initiativeId}/Indicadores/${topic.id}`,
                            icon: ChevronRight,
                            label: uiText.cardsAttachment.topics.gotoBtn.label,
                            title: uiText.cardsAttachment.topics.gotoBtn.title,
                          }}
                        />
                      );
                    })}

                  {(departmentId &&
                    !initiativeId &&
                    initiatives.length === 0) ||
                    (initiativeId && topics.length === 0 && (
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
