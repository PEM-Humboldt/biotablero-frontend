import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";

import type {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
  InitiativeFullInfo,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { InitiativeInfoDetail } from "pages/monitoring/outlets/initiativesAdmin/initiativesDisplay/InitiativeInfoDetail";
import { InitiativeAccordeonBar } from "pages/monitoring/outlets/initiativesAdmin/initiativesDisplay/InitiativeAccordeonBar";
import { cn } from "@ui/shadCN/lib/utils";

export function InitiativesDisplay({
  initiativesInfo,
  updater: updater,
}: {
  initiativesInfo: Record<
    string,
    InitiativeDisplayInfoShort | InitiativeDisplayInfo
  > | null;
  updater: (value: InitiativeFullInfo) => void;
}) {
  return initiativesInfo === null ? (
    <div>No hay iniciativas</div>
  ) : (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {Object.entries(initiativesInfo).map(([id, initiative]) => (
        <AccordionItem value={String(id)} key={String(id)}>
          <AccordionTrigger
            className={cn("cursor-pointer", !initiative.enabled && "bg-red-50")}
          >
            <InitiativeAccordeonBar initiative={initiative} />
          </AccordionTrigger>
          <AccordionContent className="px-2">
            <InitiativeInfoDetail initiative={initiative} updater={updater} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
