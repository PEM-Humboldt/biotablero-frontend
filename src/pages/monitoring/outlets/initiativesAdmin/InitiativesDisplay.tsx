import type {
  LocationBasicInfo,
  ODataInitiativeEntry,
} from "pages/monitoring/types/requestParams";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";
import { InitiativeInfoDetail } from "./initiativesDisplay/InitiativeInfoDetail";
import { getLocationInfoById } from "pages/monitoring/utils/manageLocation";
import { useEffect, useState } from "react";

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
        <AccordionItem value={initiative.name} key={initiative.name}>
          <AccordionTrigger>
            <InitiativeBar initiativeInfo={initiative} />
          </AccordionTrigger>
          <AccordionContent>
            <InitiativeInfoDetail initiativeId={initiative.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function InitiativeBar({
  initiativeInfo,
}: {
  initiativeInfo: ODataInitiativeEntry;
}) {
  const [location, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const promises = initiativeInfo.locations.map(
        async ({ locationId, locality }) => {
          const info = await getLocationInfoById(locationId);
          if (!info) {
            return null;
          }
          const parent = info.parent ? `${info.parent.name}, ` : "";
          const localityName = locality ? ` - ${locality}` : "";

          return `${parent}${info.name}${localityName}`;
        },
      );

      const results = await Promise.all(promises);
      setLocations(results.filter((loc): loc is string => loc !== null));
    };

    void fetchLocations();
  }, [initiativeInfo.locations]);

  const date = new Date(initiativeInfo.creationDate).toLocaleDateString(
    "es-CO",
  );
  const displayName = initiativeInfo.shortName
    ? `${initiativeInfo.name}, ${initiativeInfo.shortName}`
    : initiativeInfo.name;

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
        <div>{location.join(" / ")}</div>
      </div>
    </>
  );
}
