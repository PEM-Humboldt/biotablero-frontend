import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";

import { getLocationsList } from "pages/monitoring/api/services/location";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  Binoculars,
  ChevronRight,
  CircleChevronLeft,
  PlusCircle,
} from "lucide-react";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { StatsTabs } from "pages/monitoring/outlets/initiativesMap/dataSheetAndNavigation/StatsTabs";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import { LoadingDiv } from "@ui/LoadingDiv";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import type { IndicatorMetadata } from "pages/monitoring/types/indicators";
import { getIndicatorsByInitiative } from "pages/monitoring/api/services/indicators";

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
    <div className="relative md:absolute w-full md:w-[40%] max-w-[450px] top-4 left-4 z-10 rounded-lg shadow-md">
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
            Ir a la iniciativa
            <ChevronRight />
          </Button>
        )}

        <StatsTabs />
      </div>

      <CardsAttachment />
    </div>
  );
}

function CardsAttachment() {
  const { departmentId, initiativeId } = useParams();
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [indicators, setIndicators] = useState<IndicatorMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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
          <section>
            <h4 className="flex gap-2 items-center bg-primary text-primary-foreground text-lg m-0 p-2 rounded-t-lg border border-primary/50">
              <Binoculars
                className="size-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              {initiativeId ? "Indicadores" : "Iniciativas"}
            </h4>

            <div className="bg-grey-light rounded-b-lg p-2 space-y-2 border border-primary/50">
              {!initiativeId && initiatives.length > 0
                ? initiatives.map((initiative) => (
                    <RenderInitiativeCard initiative={initiative} />
                  ))
                : "No se encontraron iniciativas"}

              {initiativeId && indicators.length > 0
                ? indicators.map((indicator) => (
                    <RenderIndicatorCard indicator={indicator} />
                  ))
                : "No se encontraron indicadores"}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function RenderInitiativeCard({
  initiative,
}: {
  initiative: InitiativeByLocation;
}) {
  const { departmentId } = useParams();

  const date = initiative?.creationDate
    ? new Date(initiative.creationDate)
    : new Date();

  const tags = (initiative.tags || []).reduce<Record<number, string[]>>(
    (all, tag) => {
      if (!all[tag.tag.category.id]) {
        all[tag.tag.category.id] = [];
      }
      if (tag.tag?.name) {
        all[tag.tag.category.id].push(tag.tag.name);
      }
      return all;
    },
    {},
  );

  return (
    <div
      key={`elementCard_${initiative.initiativeId}`}
      className="bg-background p-2 rounded-lg outline outline-transparent hover:outline-primary transition-colors duration-300"
    >
      <h5 className="text-lg mb-0 px-2">{initiative.initiativeName}</h5>

      <div className="flex gap-2">
        <TagsRender
          tags={tags[1]}
          srTitle="Etiquetas 1"
          className="[&_li]:bg-blue-200 [&_li]:text-blue-800 font-normal"
        />
        <TagsRender
          tags={tags[2]}
          srTitle="Etiquetas 2"
          className="[&_li]:bg-green-100 [&_li]:text-green-800 font-normal"
        />
      </div>

      <hr className="border-t border-grey-light mt-2" />

      <div className="px-2 flex justify-between items-center">
        <time
          dateTime={date.toISOString().split("T")[0]}
          title={`Monitorea desde ${date.toLocaleDateString()}`}
          className="text-sm m-0"
        >
          {date.toLocaleDateString()}
        </time>

        <Button variant="ghost-clean" size="sm" className="px-0! mx-0" asChild>
          <Link
            to={`/Monitoreo/Departamento/${departmentId}/${initiative.initiativeId}`}
          >
            Ver más <PlusCircle className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function RenderIndicatorCard({ indicator }: { indicator: IndicatorMetadata }) {
  const tags = (indicator.tags || []).reduce<Record<number, string[]>>(
    (all, tag) => {
      if (!all[tag.tag.category.id]) {
        all[tag.tag.category.id] = [];
      }
      if (tag.tag?.name) {
        all[tag.tag.category.id].push(tag.tag.name);
      }
      return all;
    },
    {},
  );

  return (
    <div
      key={`elementCard_${indicator.initiativeId}`}
      className="bg-background p-2 rounded-lg outline outline-transparent hover:outline-primary transition-colors duration-300"
    >
      <h5 className="text-lg mb-0 px-2">{indicator.type.name}</h5>

      <div className="flex gap-2">
        <TagsRender
          tags={tags[3]}
          srTitle="Etiquetas 3"
          className="[&_li]:bg-blue-200 [&_li]:text-blue-800 font-normal"
        />
        <TagsRender
          tags={tags[4]}
          srTitle="Etiquetas 4"
          className="[&_li]:bg-green-100 [&_li]:text-green-800 font-normal"
        />
      </div>

      <hr className="border-t border-grey-light mt-2" />

      <div className="px-2 flex justify-between items-center">
        <span>Version: {indicator.versions[0].version}</span>

        <Button variant="ghost-clean" size="sm" className="px-0! mx-0" asChild>
          <Link to={`/Monitoreo/Indicadores/${indicator.id}`}>
            Ir al indicador <ChevronRight className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
