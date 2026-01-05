import type { ODataInitiativeEntry } from "pages/monitoring/types/requestParams";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";
import { InitiativeInfoDetail } from "./initiativesDisplay/InitiativeInfoDetail";

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
            {initiative.shortName
              ? `${initiative.shortName} » ${initiative.name}`
              : initiative.name}
          </AccordionTrigger>
          <AccordionContent>
            <InitiativeInfoDetail initiativeId={initiative.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
