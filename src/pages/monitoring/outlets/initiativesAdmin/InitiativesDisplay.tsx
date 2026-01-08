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
import { cn } from "@ui/shadCN/lib/utils";
import { InitiativeAccordeonBar } from "pages/monitoring/outlets/initiativesAdmin/initiativesDisplay/InitiativeAccordeonBar";

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
        <AccordionInitiativeItem
          key={initiative.name}
          initiative={initiative}
        />
      ))}
    </Accordion>
  );
}

function AccordionInitiativeItem({
  initiative,
}: {
  initiative: ODataInitiativeEntry;
}) {
  const [location, setLocation] = useState<LocationObj[]>([]);

  useEffect(() => {
    const locationsInfo = initiative.locations.map(makeLocationObj);
    setLocation(locationsInfo);
  }, [initiative.locations]);

  return (
    <AccordionItem value={initiative.name}>
      <AccordionTrigger className="cursor-pointer">
        <InitiativeAccordeonBar info={initiative} locations={location} />
      </AccordionTrigger>
      <AccordionContent className="px-2">
        <InitiativeInfoDetail initiativeId={initiative.id} />
      </AccordionContent>
    </AccordionItem>
  );
}
