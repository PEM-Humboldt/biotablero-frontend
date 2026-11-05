import { BadgeCheck, type LucideIcon } from "lucide-react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { Spinner } from "@ui/shadCN/component/spinner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/shadCN/component/tabs";

import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";
import type { TopicMetadata } from "pages/monitoring/types/topics";
import { GraphSelector } from "pages/monitoring/outlets/initiatives/topics/card/GraphSelector";
import { uiText } from "pages/monitoring/outlets/initiatives/topics/layout/uiText";
import { AddMCTopicToReport } from "@ui/AddMCIndicatorToReport";
import { useLocation, useParams } from "react-router";
import { InitiativeError } from "pages/monitoring/outlets/initiatives/InitiativeError";
import { parseSimpleMarkdown } from "@utils/textParser";

interface RouterState {
  from?: string;
}

export function Card() {
  const { topics, currentTopic, isLoading, errors } = useTopicsCTX();
  const { detailItem } = useParams();
  const location = useLocation();

  const topicTabs = uiText.topicCard.tabs.reduce<
    { key: string; label: string; icon: LucideIcon; text: string }[]
  >((all, current) => {
    const value = currentTopic?.[current.key as keyof TopicMetadata];

    if (value && typeof value === "string") {
      all.push({ ...current, text: value });
    }

    return all;
  }, []);

  if (!isLoading && detailItem && !currentTopic && errors.length) {
    const state = location.state as RouterState | null;
    const previousUrl = state?.from || "/Monitoreo";

    return (
      <InitiativeError
        msg="el indicador que buscas no se encuentra en este enlace"
        errors={errors}
        goBack={previousUrl}
      />
    );
  }

  return (
    <main className="flex-3">
      <ErrorsList
        errorItems={errors}
        className="m-2 p-4 bg-accent/10 border border-accent rounded-lg"
      />

      {!currentTopic ? (
        <div className="m-8 p-4 text-2xl bg-primary/10 text-primary rounded-lg border border-primary font-normal">
          {topics.length === 0
            ? uiText.topicCard.noTopcis
            : uiText.topicCard.noSelection}
        </div>
      ) : (
        <div className="lg:block lg:sticky lg:top-2 max-w-[1200px] space-y-4">
          <AddMCTopicToReport />

          <header className="bg-primary p-4 flex justify-between gap-2 rounded-lg">
            {isLoading && (
              <Spinner className="text-primary-foreground size-8 self-center" />
            )}

            <div className="text-primary-foreground font-normal">
              <h3 className="m-0 mt-1">{currentTopic.topicType.name}</h3>

              <span className="text-base italic" title="Etiquetas">
                {currentTopic.tags.map((t) => t.tag.name).join(" - ")}
              </span>
            </div>

            <time
              dateTime={new Date(currentTopic.creationDate).toISOString()}
              className="text-primary-foreground border border-accent-foreground/20 rounded self-start px-2 py-1 italic text-sm font-normal"
            >
              {uiText.topicCard.titleBar.lastUpdate(currentTopic.creationDate)}
            </time>
          </header>

          <div className="flex flex-wrap flex-col xl:flex-row gap-4">
            <section className="flex-2 xl:flex-3 w-full h-full bg-background rounded-lg p-2 shadow-2xl">
              <h4 className="sr-only">
                Gráfica de {currentTopic.topicType.name}
              </h4>
              <GraphSelector />
            </section>

            {currentTopic?.description && (
              <section className="flex-1 p-8 bg-background md:min-w-[200px] rounded-lg shadow-2xl">
                <h4 className="flex gap-1 items-center">
                  <BadgeCheck className="text-accent" />
                  {uiText.search.card.descriptionTitle}
                  {isLoading && <Spinner className="text-primary ml-2" />}
                </h4>

                <div className="markdown-renderer">
                  {parseSimpleMarkdown(currentTopic.description)}
                </div>
              </section>
            )}
          </div>

          {Object.keys(topicTabs).length > 0 && (
            <div className="bg-background rounded-b-lg overflow-hidden shadow-2xl">
              <Tabs
                className="flex flex-col h-full"
                defaultValue={topicTabs[0].label}
              >
                <TabsList className="w-full h-auto flex *:flex-1 bg-accent gap-0 p-0! m-0!">
                  {topicTabs.map((tab) => (
                    <TabsTrigger
                      key={`tabTriggerTopic_${tab.key}`}
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
                {topicTabs.map((tab) => (
                  <TabsContent
                    key={`tabContentTopic_${tab.key}`}
                    value={tab.label}
                    className="m-0 p-4 pb-0 h-full "
                  >
                    <section className="p-4 pb-8 ">
                      <h4 className="sr-only">{tab.label}</h4>

                      <div className="markdown-renderer">
                        {parseSimpleMarkdown(tab.text)}
                      </div>
                    </section>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
