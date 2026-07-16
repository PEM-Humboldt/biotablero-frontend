import {
  Network,
  BadgeCheck,
  FilePlusCorner,
  FolderDown,
  BookOpenCheck,
  MessageCircleWarning,
  FilePenLine,
} from "lucide-react";

import type { GetKeysWithStringValues } from "@appTypes/utils";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Spinner } from "@ui/shadCN/component/spinner";
import { LOCALE } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/shadCN/component/tabs";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { IndicatorMetadata } from "pages/monitoring/types/indicators";
import { GraphSelector } from "pages/monitoring/outlets/initiatives/indicators/card/GraphSelector";

const tabs = [
  { key: "methodology", label: "Metodología", icon: Network },
  { key: "interpretation", label: "Interpretación", icon: BookOpenCheck },
  {
    key: "considerations",
    label: "Consideración",
    icon: MessageCircleWarning,
  },
  { key: "authorship", label: "Autoría", icon: FilePenLine },
];

export function Card() {
  const { currentIndicator, isLoading, errors } = useIndicatorsCTX();

  return (
    <main className="flex-3 bg-[#f5f5f5]">
      <ErrorsList
        errorItems={errors}
        className="m-2 p-4 bg-accent/10 border border-accent rounded-lg"
      />

      {!currentIndicator ? (
        <div className="m-8 p-4 text-2xl bg-primary/10 text-primary rounded-lg border border-primary font-normal">
          Selecciona un indicador
        </div>
      ) : (
        <>
          <header className="bg-primary mx-4 mt-2 p-4 flex gap-2 rounded-lg">
            {isLoading && (
              <Spinner className="text-primary-foreground size-8 self-center" />
            )}
            <h3 className="m-0 flex flex-col flex-wrap flex-1 text-primary-foreground font-normal">
              <span> {currentIndicator.name}</span>
              <span className="text-base italic">
                {currentIndicator.type.name}
              </span>
            </h3>
            <ButtonGroup>
              <Button variant="outline">
                Añadir
                <FilePlusCorner />
              </Button>
              <Button variant="outline">
                Descargar
                <FolderDown />
              </Button>
            </ButtonGroup>
            <time
              dateTime={new Date(currentIndicator.creationDate).toISOString()}
              className="text-primary-foreground border border-accent-foreground/20 rounded self-start px-2 py-1"
            >
              {new Date(currentIndicator.creationDate).toLocaleDateString(
                LOCALE,
                { day: "numeric", month: "long", year: "numeric" },
              )}
            </time>
          </header>

          <div className="flex flex-wrap flex-col md:flex-row gap-4 p-4">
            <section className="flex-2 md:min-w-[500px] aspect-3/2">
              <div className="w-full h-full bg-background rounded-lg p-2 shadow-2xl flex flex-col gap-2">
                <GraphSelector />
              </div>
            </section>

            <section className="flex-1 p-4 bg-background md:min-w-[200px] rounded-lg shadow-2xl">
              <h4 className="flex gap-1 items-center">
                <BadgeCheck className="text-accent" /> ¿Qué dice este indicador?
                {isLoading && <Spinner className="text-primary ml-2" />}
              </h4>
              {currentIndicator.description.split("\n").map((par, i) => (
                <p key={`currentDescription_${i}`}>{par}</p>
              ))}
            </section>
          </div>

          <div className="bg-background mx-4 mb-4 rounded-b-lg overflow-hidden shadow-2xl">
            <Tabs className="flex flex-col h-full" defaultValue={tabs[0].label}>
              <TabsList className="w-full h-auto flex *:flex-1 bg-accent p-0! m-0!">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={`tabTriggerIndicator_${tab.key}`}
                    value={tab.label}
                    className="text-lg border-b-2 border-b-primary data-[state=active]:border-b-accent data-[state=active]:bg-primary data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-background bg-grey-light text-primary data-[state=active]:text-background justify-start p-0 cursor-pointer data-[state=active]:cursor-auto"
                  >
                    <tab.icon
                      className="bg-primary/20 p-2 mr-2 size-9 "
                      aria-hidden="true"
                    />
                    {tab.label}
                    {isLoading && <Spinner className="ml-2" />}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent
                  key={`tabContentIndicator_${tab.key}`}
                  value={tab.label}
                  className="m-0 p-4 pb-0 h-full "
                >
                  <section>
                    <h4 className="sr-only">{tab.label}</h4>
                    {currentIndicator[
                      tab.key as GetKeysWithStringValues<IndicatorMetadata>
                    ]
                      .split("\n")
                      .map((par, i) => (
                        <p key={`tabContent_${tab.label}_${i}`}>{par}</p>
                      ))}
                  </section>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </>
      )}
    </main>
  );
}
