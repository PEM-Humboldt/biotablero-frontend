import { useMemo } from "react";
import { Link } from "react-router";
import { ChevronRightCircle } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import { LOCALE } from "@config/global";

import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";
import type { TopicMetadata } from "pages/monitoring/types/topics";
import { uiText } from "pages/monitoring/outlets/initiatives/topics/layout/uiText";
import { TagsGroupsRender } from "pages/monitoring/ui/TagsGroupsRender";

export function TopicSmallCard({ topic }: { topic: TopicMetadata }) {
  const { currentTopic } = useTopicsCTX();
  const isCurrent = currentTopic && topic.id === currentTopic.topicId;

  const { since, until } = useMemo(
    () =>
      topic.versions.length === 1
        ? {
            since: new Date(topic.versions[0].creationDate),
            until: null,
          }
        : topic.versions.reduce(
            (acc, v) => {
              const current = new Date(v.creationDate);
              if (current < acc.since) {
                acc.since = current;
              }
              if (current > acc.until) {
                acc.until = current;
              }
              return acc;
            },
            {
              since: new Date(topic.versions[0].creationDate),
              until: new Date(topic.versions[0].creationDate),
            },
          ),
    [topic.versions],
  );

  return (
    <div
      className={cn(
        "p-4 pb-3 rounded-xl outline outline-transparent hover:outline-primary transition-colors duration-300",
        isCurrent ? "bg-muted outline-primary" : "bg-background shadow-2xl",
      )}
    >
      <h4 className="mb-1 text-balance">{topic.topicType.name}</h4>
      <div className="flex flex-wrap m-1 ml-0 gap-2">
        <TagsGroupsRender
          tags={topic.tags.map((t) => t.tag)}
          groupId={topic.name.replaceAll(" ", "")}
          colorIndexOffset={3}
        />
      </div>

      <hr className="mt-2 border-grey-light" />

      {until === null ? (
        <div className="flex gap-2 justify-between p-1 rounded items-center hover:bg-muted">
          <div className="text-sm flex flex-col *:m-0!">
            <span>{uiText.search.card.singleVersion.title}</span>
            <time dateTime={since.toISOString()}>
              {since.toLocaleDateString(LOCALE)}
            </time>
          </div>
          {!isCurrent && (
            <Button variant="ghost-clean" className="px-1!" asChild>
              <Link
                to={`/Monitoreo/Iniciativas/${topic.initiativeId}/Indicadores/${topic.versions[0].id}`}
                title={uiText.search.card.gotoBtn.title}
                aria-label={uiText.search.card.gotoBtn.sr}
              >
                {uiText.search.card.gotoBtn.label}
                <ChevronRightCircle />
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div>
          <dl className="text-sm mb-2 flex justify-between gap-2 *:m-0! *:flex *:flex-col text-center *:items-center">
            <div>
              <dt>{uiText.search.card.nVersions.title}</dt>
              <dd className="font-normal">{topic.versions.length}</dd>
            </div>

            <div>
              <dt>{uiText.search.card.nVersions.first}</dt>
              <dd className="font-normal">
                <time dateTime={since.toISOString()}>
                  {since.toLocaleDateString(LOCALE)}
                </time>
              </dd>
            </div>

            <div>
              <dt>{uiText.search.card.nVersions.last}</dt>
              <dd className="font-normal">
                <time dateTime={until.toISOString()}>
                  {until.toLocaleDateString(LOCALE)}
                </time>
              </dd>
            </div>
          </dl>

          {topic.versions
            .toSorted((a, b) => a.version - b.version)
            .map((v) => {
              const date = new Date(v.creationDate);

              return (
                <div
                  key={`version_${topic.id}_${v.version}`}
                  className="flex gap-2 justify-between p-1 rounded items-center hover:bg-muted"
                >
                  <div className="text-sm flex flex-col *:m-0!">
                    <span>Version {v.version}</span>
                    <time dateTime={date.toISOString()}>
                      {date.toLocaleDateString(LOCALE)}
                    </time>
                  </div>
                  {!(isCurrent && currentTopic.version === v.version) && (
                    <Button variant="ghost-clean" className="px-1!" asChild>
                      <Link
                        to={`/Monitoreo/Iniciativas/${topic.initiativeId}/Indicadores/${v.id}`}
                        title={uiText.search.card.gotoBtn.title}
                        aria-label={uiText.search.card.gotoBtn.sr}
                      >
                        {uiText.search.card.gotoBtn.label}
                        <ChevronRightCircle />
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
