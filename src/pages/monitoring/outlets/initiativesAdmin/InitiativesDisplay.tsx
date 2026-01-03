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
    <Accordion type="single" collapsible className="w-full space-y-3">
      {initiativesInfo.map((initiative) => (
        <AccordionItem value={initiative.name}>
          <AccordionTrigger>
            {initiative.shortName
              ? `${initiative.shortName} // ${initiative.name}`
              : initiative.name}
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
