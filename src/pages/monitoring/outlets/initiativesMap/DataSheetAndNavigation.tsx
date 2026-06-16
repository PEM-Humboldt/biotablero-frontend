import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Button } from "@ui/shadCN/component/button";

import { getLocationsList } from "pages/monitoring/api/services/location";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { ChevronRight, CircleChevronLeft } from "lucide-react";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";

export function DataSheetAndNavigation({
  initiatives,
}: {
  initiatives: InitiativeByLocation[];
}) {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Record<number, string>>({});
  const { departmentId, initiativeId } = useParams();

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
    <div className="relative md:absolute w-full md:w-[40%] max-w-[400px] top-4 left-4 z-10 rounded-lg shadow-md">
      <header className="bg-primary px-4 h-12 border border-primary/50 border-b-0 rounded-t-lg flex gap-2 justify-between items-center">
        <h4
          className="uppercase text-primary-foreground mb-0"
          aria-label={title}
        >
          Cifras generales
        </h4>
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
            title={initiativeId ? "Volver al departamento" : "Volver al país"}
          >
            <CircleChevronLeft className="size-6" />
          </Button>
        )}
      </header>

      <div className="bg-background flex flex-col items-start border border-primary/50 border-t-0 rounded-b-lg p-4 pt-2">
        <div
          className="text-xl w-full m-0 border-b border-b-muted"
          aria-hidden="true"
        >
          {statsScope}
        </div>

        {initiativeId && (
          <Button
            onClick={() =>
              void navigate(`/Monitoreo/Iniciativas/${initiativeId}`)
            }
            size="sm"
            variant="outline"
            className="mt-1"
          >
            <ChevronRight />
            Ir a la iniciativa
          </Button>
        )}

        <Stats />
      </div>
    </div>
  );
}

function Stats() {
  return null;
}
