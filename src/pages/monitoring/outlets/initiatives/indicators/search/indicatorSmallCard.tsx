import { LOCALE, TAG_COLORS } from "@config/monitoring";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import { ChevronRightCircle } from "lucide-react";
import { Link } from "react-router";
import type { IndicatorMetadata } from "pages/monitoring/types/indicators";
import { useMemo } from "react";

export function IndicatorSmallCard({
  indicator,
}: {
  indicator: IndicatorMetadata;
}) {
  const { currentIndicator } = useIndicatorsCTX();
  const isCurrent = currentIndicator && indicator.id === currentIndicator.id;

  const tagsGrouped = useMemo(
    () =>
      (indicator.tags || []).reduce<Record<number, string[]>>((all, tag) => {
        if (!all[tag.tag.id]) {
          all[tag.tag.id] = [];
        }
        all[tag.tag.id].push(tag.tag.name);

        return all;
      }, {}),
    [indicator.tags],
  );

  const { since, until } = useMemo(
    () =>
      indicator.versions.length === 1
        ? {
            since: new Date(indicator.versions[0].creationDate),
            until: null,
          }
        : indicator.versions.reduce(
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
              since: new Date(indicator.versions[0].creationDate),
              until: new Date(indicator.versions[0].creationDate),
            },
          ),
    [indicator.versions],
  );

  return (
    <div
      className={cn(
        "p-3 pb-2 rounded-xl outline outline-transparent hover:outline-primary transition-colors duration-300",
        isCurrent ? "bg-muted outline-primary" : "bg-background shadow-2xl",
      )}
    >
      <h4 className="mb-1">{indicator.name}</h4>
      <div className="flex flex-wrap m-1 ml-0 gap-2">
        {Object.values(tagsGrouped).map((group, i) => {
          const colorValues = TAG_COLORS[i % TAG_COLORS.length];
          const colorSet = `${colorValues.bg} ${colorValues.fg}`;

          return (
            <TagsRender
              key={`tags_${indicator.id}_${group[i]}_${i}`}
              tags={group}
              srTitle=""
              className={cn(colorSet, "font-normal")}
            />
          );
        })}
      </div>

      <hr className="mt-2 border-grey-light" />

      {until === null ? (
        <div className="flex gap-2 justify-between p-1 rounded items-center hover:bg-muted">
          <div className="text-sm flex flex-col *:m-0!">
            <span>Publicado</span>
            <time dateTime={since.toISOString()}>
              {since.toLocaleDateString(LOCALE)}
            </time>
          </div>
          {!isCurrent && (
            <Button variant="ghost-clean" className="px-1!" asChild>
              <Link
                to={`/Monitoreo/Iniciativas/${indicator.initiativeId}/Indicadores/${indicator.versions[0].id}`}
              >
                Ver indicador <ChevronRightCircle />
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div>
          <dl className="text-sm mb-2 flex gap-2 *:m-0! *:flex *:flex-col *:items-center">
            <div>
              <dt>Versiones</dt>
              <dd className="font-normal">{indicator.versions.length}</dd>
            </div>

            <div>
              <dt>Primera publicación</dt>
              <dd className="font-normal">
                <time dateTime={since.toISOString()}>
                  {since.toLocaleDateString(LOCALE)}
                </time>
              </dd>
            </div>

            <div>
              <dt>Última actualización</dt>
              <dd className="font-normal">
                <time dateTime={until.toISOString()}>
                  {until.toLocaleDateString(LOCALE)}
                </time>
              </dd>
            </div>
          </dl>

          {indicator.versions
            .toSorted((a, b) => a.version - b.version)
            .map((v) => {
              const date = new Date(v.creationDate);

              return (
                <div className="flex gap-2 justify-between p-1 rounded items-center hover:bg-muted">
                  <div className="text-sm flex flex-col *:m-0!">
                    <span>Version {v.version}</span>
                    <time dateTime={date.toISOString()}>
                      {date.toLocaleDateString(LOCALE)}
                    </time>
                  </div>
                  {!isCurrent && (
                    <Button variant="ghost-clean" className="px-1!" asChild>
                      <Link
                        to={`/Monitoreo/Iniciativas/${indicator.initiativeId}/Indicadores/${v.id}`}
                      >
                        Ver indicador <ChevronRightCircle />
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
