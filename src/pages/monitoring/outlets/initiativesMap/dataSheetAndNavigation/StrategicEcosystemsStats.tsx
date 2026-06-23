import { useMemo } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";

import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { definitions } from "pages/monitoring/layout/glosary/definitions";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";

export function StrategicEcosystemsStats() {
  const { isLoading, errors, stats } = useStats("Ecosystems");

  const { ecosystemsInvolved } = stats ?? {};

  const ecosystemsAndDefinitions = useMemo<Record<string, string>>(
    () =>
      ecosystemsInvolved
        ? ecosystemsInvolved.reduce<Record<string, string>>((all, current) => {
            const definition = definitions.find(
              (d) => d.word.toLowerCase() === current.name.toLowerCase(),
            );
            if (definition) {
              all[current.name] = definition.definition;
            }
            return all;
          }, {})
        : {},
    [ecosystemsInvolved],
  );

  const hasEcosystemsAssociated =
    Object.keys(ecosystemsAndDefinitions).length > 0;

  return (
    <div className="space-y-2">
      {isLoading && <LoadingDiv />}

      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />

      {hasEcosystemsAssociated ? (
        <>
          <p className="p-2">{uiText.stats.ecosystems.preText}</p>

          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-2 [&_h3]:m-0!"
          >
            {Object.entries(ecosystemsAndDefinitions).map(
              ([name, description]) => (
                <AccordionItem
                  key={`ecosystemDescription_${name}`}
                  value={`ecosystemDescription_${name}`}
                  className="my-0!"
                >
                  <AccordionTrigger className="text-primary font-normal">
                    {name}
                  </AccordionTrigger>
                  <AccordionContent className="py-4 overflow-hidden">
                    {description}
                  </AccordionContent>
                </AccordionItem>
              ),
            )}
          </Accordion>
        </>
      ) : (
        <div className="bg-primary/10 p-4 rounded-lg">
          {uiText.stats.ecosystems.noItems}
        </div>
      )}
    </div>
  );
}
