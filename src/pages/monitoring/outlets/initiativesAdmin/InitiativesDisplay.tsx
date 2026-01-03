import type { ODataInitiativeEntry } from "pages/monitoring/types/requestParams";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";

export function InitiativesDisplay({
  initiativesInfo,
}: {
  initiativesInfo: ODataInitiativeEntry[];
}) {
  return initiativesInfo.length === 0 ? (
    <div>No hay iniciativas</div>
  ) : (
    <Accordion type="single" className="w-full">
      {initiativesInfo.map((initiative) => (
        <AccordionItem value={initiative.name}>
          <AccordionTrigger>
            {initiative.shortName ?? initiative.name}
          </AccordionTrigger>
          <AccordionContent>
            <h4>{initiative.name}</h4>
            <p>{initiative.description}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
