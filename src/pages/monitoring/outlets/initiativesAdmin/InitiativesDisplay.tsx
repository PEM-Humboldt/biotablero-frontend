import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";

import type { ODataInitiativeEntry } from "pages/monitoring/types/requestParams";
import type { LocationObj } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { InitiativeInfoDetail } from "pages/monitoring/outlets/initiativesAdmin/initiativesDisplay/InitiativeInfoDetail";
import { makeLocationObj } from "pages/monitoring/outlets/initiativesAdmin/utils/builders";

export function InitiativesDisplay({
  initiativesInfo,
}: {
  initiativesInfo: ODataInitiativeEntry[];
}) {
  return initiativesInfo.length === 0 ? (
    <div>No hay iniciativas</div>
  ) : (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {initiativesInfo.map((initiative) => (
        <AccordionInitiativeItem info={initiative} />
      ))}
    </Accordion>
  );
}

function AccordionInitiativeItem({ info }: { info: ODataInitiativeEntry }) {
  const [locations, setLocations] = useState<LocationObj[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const promises = info.locations.map(
        async ({ locationId, locality }) =>
          await makeLocationObj(locationId, locality),
      );

      const results = await Promise.all(promises);
      setLocations(results.filter((loc) => loc !== null));
    };

    void fetchLocations();
  }, [info.locations]);

  return (
    <AccordionItem value={info.name} key={info.name}>
      <AccordionTrigger>
        <InitiativeBar
          dateRaw={new Date(info.creationDate)}
          name={info.name}
          shortName={info.shortName}
          locations={locations}
        />
      </AccordionTrigger>
      <AccordionContent>
        <InitiativeInfoDetail initiativeId={info.id} />
      </AccordionContent>
    </AccordionItem>
  );
}

function InitiativeBar({
  dateRaw,
  name,
  shortName,
  locations,
}: {
  dateRaw: Date;
  name: string;
  shortName: string;
  locations: LocationObj[];
}) {
  const date = new Date(dateRaw).toLocaleDateString("es-CO");
  const displayName = shortName ? `${name}, ${shortName}` : name;
  const initiativeLocations = locations
    .map((l) => {
      const municipality = l.municipality !== null ? `, ${l.municipality}` : "";
      const locality = l.locality !== null ? ` - ${l.locality}` : "";

      return `${l.department}${municipality}${locality}`;
    })
    .join(" / ");

  return (
    <>
      <div className="shrink-0">{date}</div>
      <div className="flex-1 min-w-0 *:px-2 *:truncate">
        <div
          className="font-semibold border-b border-b-primary/10"
          title={displayName}
        >
          {displayName}
        </div>
        <div>{initiativeLocations}</div>
      </div>
    </>
  );
}
