import { BadgeCheck, type LucideIcon } from "lucide-react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { Spinner } from "@ui/shadCN/component/spinner";
import { LOCALE } from "@config/monitoring";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/shadCN/component/tabs";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { IndicatorMetadata } from "pages/monitoring/types/indicators";
import { GraphSelector } from "pages/monitoring/outlets/initiatives/indicators/card/GraphSelector";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";

export function Card() {
  const { indicators, currentIndicator, isLoading, errors } =
    useIndicatorsCTX();

  const indicatorTabs = uiText.indicatorCard.tabs.reduce<
    { key: string; label: string; icon: LucideIcon; text: string }[]
  >((all, current) => {
    const value = currentIndicator?.[current.key as keyof IndicatorMetadata];

    if (value && typeof value === "string") {
      all.push({ ...current, text: value });
    }

    return all;
  }, []);

  return (
    <main className="flex-3 bg-[#f5f5f5]">
      <ErrorsList
        errorItems={errors}
        className="m-2 p-4 bg-accent/10 border border-accent rounded-lg"
      />

      {!currentIndicator ? (
        <div className="m-8 p-4 text-2xl bg-primary/10 text-primary rounded-lg border border-primary font-normal">
          {indicators.length === 0
            ? uiText.indicatorCard.noIndicators
            : uiText.indicatorCard.noSelection}
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
            <section className="flex-2 xl:flex-3 w-full h-full bg-background rounded-lg p-2 shadow-2xl">
              <h4 className="sr-only">
                Gráfica de {currentIndicator.type.name}
              </h4>
              <GraphSelector />
            </section>

            {currentIndicator?.description && (
              <section className="flex-1 p-4 bg-background md:min-w-[200px] rounded-lg shadow-2xl">
                <h4 className="flex gap-1 items-center">
                  <BadgeCheck className="text-accent" />
                  {uiText.search.card.descriptionTitle}
                  {isLoading && <Spinner className="text-primary ml-2" />}
                </h4>

                {currentIndicator.description.split("\n").map((par, i) => (
                  <p key={`currentDescription_${i}`}>{par}</p>
                ))}
              </section>
            )}
          </div>

          {Object.keys(indicatorTabs).length > 0 && (
            <div className="bg-background mx-4 mb-4 rounded-b-lg overflow-hidden shadow-2xl">
              <Tabs
                className="flex flex-col h-full"
                defaultValue={indicatorTabs[0].label}
              >
                <TabsList className="w-full h-auto flex *:flex-1 bg-accent p-0! m-0!">
                  {indicatorTabs.map((tab) => (
                    <TabsTrigger
                      key={`tabTriggerIndicator_${tab.key}`}
                      value={tab.label}
                      className="text-sm lg:text-lg border-b-2 border-b-primary data-[state=active]:border-b-accent data-[state=active]:bg-primary data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-background bg-grey-light text-primary data-[state=active]:text-background justify-start p-0 cursor-pointer data-[state=active]:cursor-auto"
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
                {indicatorTabs.map((tab) => (
                  <TabsContent
                    key={`tabContentIndicator_${tab.key}`}
                    value={tab.label}
                    className="m-0 p-4 pb-0 h-full "
                  >
                    <section>
                      <h4 className="sr-only">{tab.label}</h4>

                      {tab.text.split("\n").map((par, i) => (
                        <p key={`tabContent_${tab.label}_${i}`}>{par}</p>
                      ))}
                    </section>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </>
      )}
    </main>
  );
}
