import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronRight,
  CircleChevronLeft,
  Expand,
  Minimize2,
} from "lucide-react";

import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { Button } from "@ui/shadCN/component/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/shadCN/component/collapsible";

import { getLocationsList } from "pages/monitoring/api/services/location";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { StatsTabs } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/StatsTabs";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";

export function DataSheetAndNavigation({
  initiatives,
  className,
}: {
  initiatives: InitiativeByLocation[];
  className?: string;
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
      (i) => i.id === Number(initiativeId),
    );

    return foundInitiative ?? null;
  }, [initiativeId, initiatives]);

  const { statsScope, title } = useMemo(() => {
    if (currentInitiative) {
      const scopeName = currentInitiative.name;
      return {
        statsScope: scopeName,
        title: uiText.dataSheet.scope.initiativeDescription(scopeName),
      };
    }

    if (departmentId) {
      const scope = locations[Number(departmentId)] ?? "";
      return {
        statsScope: scope,
        title: uiText.dataSheet.scope.departmentDescription(scope),
      };
    }

    return {
      statsScope: uiText.dataSheet.scope.nationScope,
      title: uiText.dataSheet.scope.nationDescription,
    };
  }, [departmentId, currentInitiative, locations]);

  return (
    <div className={className}>
      <PageTitleUpdater
        title={"Iniciativas"}
        subtitle={statsScope || "Colombia"}
      />

      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <header className="bg-primary px-4 h-12 flex gap-2 justify-between items-center">
          <h4
            className="uppercase text-primary-foreground mb-0"
            aria-label={title}
          >
            {uiText.dataSheet.title}
          </h4>
          <div>
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
                title={uiText.dataSheet.goBackBtn.title(Boolean(initiativeId))}
                aria-label={uiText.dataSheet.goBackBtn.sr(
                  Boolean(initiativeId),
                )}
              >
                <CircleChevronLeft className="size-6" />
                {uiText.dataSheet.goBackBtn.label}
              </Button>
            )}

            <CollapsibleTrigger asChild>
              <Button
                className="hidden xl:inline-flex p-0 text-primary-foreground"
                variant="link"
                size="icon"
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
                    <Minimize2 className="size-6" />
                  </>
                ) : (
                  <>
                    {uiText.windowsUiText.shinkedBtn.label}
                    <Expand className="size-6" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </header>

        <div className="bg-background flex flex-col items-start p-2">
          <div
            className="text-xl font-normal w-full px-2 m-0 pb-2 border-b border-b-muted"
            aria-hidden="true"
          >
            {statsScope}
          </div>

          <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up w-full">
            {initiativeId && (
              <Button
                onClick={() =>
                  void navigate(`/Monitoreo/Iniciativas/${initiativeId}`)
                }
                size="sm"
                variant="outline"
                className="mt-1 ml-2"
                title={uiText.dataSheet.goToInitiativeBtn.title}
                aria-label={uiText.dataSheet.goToInitiativeBtn.sr}
              >
                {uiText.dataSheet.goToInitiativeBtn.label}
                <ChevronRight />
              </Button>
            )}

            <StatsTabs />
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
