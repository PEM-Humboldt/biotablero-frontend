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
        <AccordionInitiativeItem key={initiative.name} info={initiative} />
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
      setLocations(results.filter((location) => location !== null));
    };

    void fetchLocations();
  }, [info.locations]);

  return (
    <AccordionItem value={info.name}>
      <AccordionTrigger className={cn(!info.enabled && "bg-red-100")}>
        <InitiativeAccordeonBar info={info} locations={locations} />
      </AccordionTrigger>
      <AccordionContent className="px-2">
        <InitiativeInfoDetail initiativeId={info.id} />
      </AccordionContent>
    </AccordionItem>
  );
}
