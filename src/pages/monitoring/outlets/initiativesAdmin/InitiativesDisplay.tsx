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
  return (
    <>
      {initiativeInfo.shortName
        ? `${initiativeInfo.shortName} » ${initiativeInfo.name}`
        : initiativeInfo.name}
    </>
  );
}
