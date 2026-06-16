import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import { Tabs, TabsList } from "@ui/shadCN/component/tabs";

import { getLocationsList } from "pages/monitoring/api/services/location";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  ChartBar,
  ChevronRight,
  CircleChevronLeft,
  FileChartColumn,
  type LucideIcon,
  Mountain,
  UsersRound,
} from "lucide-react";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import type { StatsType } from "pages/monitoring/types/stats";
import { parseSimpleMarkdown } from "@utils/textParser";
import { cn } from "@ui/shadCN/lib/utils";

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
    <div className="relative md:absolute w-full md:w-[40%] max-w-[440px] top-4 left-4 z-10 rounded-lg shadow-md">
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

const tabsAvailable: StatsType[] = [
  "General",
  "Ecosystems",
  "Demographic",
  "Indicators",
];

const tabsUiInfo: Record<
  StatsType,
  {
    text: { title: string; srBtn?: string; labelBtn?: string };
    icon: LucideIcon;
    descriptionMD: string;
  }
> = {
  General: {
    text: { title: "Cifras generales" },
    icon: FileChartColumn,
    descriptionMD: "",
  },
  Ecosystems: {
    text: { title: "Ecosistemas estratégicos" },
    icon: Mountain,
    descriptionMD:
      "Las ventanas de estudio del monitoreo comunitario a este nivel, abarcan los siguientes ecosistemas estratégicos:",
  },
  Demographic: {
    text: { title: "Datos demográficos" },
    icon: UsersRound,
    descriptionMD:
      "Estas cifras muestran la composición de los colaboradores inscritos según su propia designación  ",
  },
  Indicators: {
    text: { title: "Indicadores por escala" },
    icon: ChartBar,
    descriptionMD:
      "Estas cifras muestran la distribución de los indicadores calculados según su nivel de [organización de la biodiversidad](https://conbio.onlinelibrary.wiley.com/doi/10.1111/j.1523-1739.1990.tb00309.x). ",
  },
};

function Stats() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string>([]);
  const [currentTab, setCurrentTab] = useState<StatsType>(tabsAvailable[0]);
  const { departmentId, initiativeId } = useParams();

  useEffect(() => {}, []);

  return (
    <Tabs
      onValueChange={(t) => setCurrentTab(t as StatsType)}
      value={currentTab}
      className="mt-2"
    >
      <TabsList className="gap-2 p-0 hover:outline-transparent! bg-transparent">
        {tabsAvailable.map((t) => {
          const Icon = tabsUiInfo[t].icon;
          return (
            <TabsTrigger key={`statsTrigger_${t}`} value={t} asChild>
              <button
                className={cn(
                  "flex flex-col flex-1 text-balance gap-1 p-2 items-center rounded-lg text-sm font-normal transition-color duration-300",
                  currentTab === t
                    ? "bg-accent text-accent-foreground shadow-2xl"
                    : "hover:text-primary-foreground hover:bg-primary hover:cursor-pointer [&_svg]:text-accent hover:[&_svg]:text-primary-foreground",
                )}
              >
                <Icon
                  className={cn("size-8")}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {tabsUiInfo[t].text.title}
              </button>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabsAvailable.map((t) => (
        <TabsContent key={`statsContent${t}`} value={t}>
          {parseSimpleMarkdown(tabsUiInfo[t].descriptionMD)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
