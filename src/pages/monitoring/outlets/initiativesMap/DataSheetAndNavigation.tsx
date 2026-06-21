import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronRight,
  CircleChevronLeft,
  Expand,
  Minimize2,
} from "lucide-react";

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
    <div className="absolute top-1 left-1 w-106 lg:top-4 lg:left-4 z-10 rounded-lg shadow-md">
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

        <div className="bg-background flex flex-col items-start border border-primary/50 border-t-0 rounded-b-lg p-2">
          <div
            className="text-xl w-full px-2 m-0 border-b border-b-muted"
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
      </Collapsible>
    </div>
  );
}
