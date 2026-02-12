import type { IndicatorsCardInfo } from "pages/indicators/types/card";
import {
  LinkIcon,
  CircleMinus,
  CirclePlus,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Button } from "@ui/shadCN/component/button";
import { parseSimpleMarkdown } from "@utils/textParser";
import { cn } from "@ui/shadCN/lib/utils";
import { StrValidator } from "@utils/strValidator";

const itemInfoCategoriesDictionary = {
  id: "id",
  title: "Título",
  target: "Objetivo",
  scale: "Escala",
  lastUpdate: "Última actualización",
  goals: "Metas",
  periodicity: "Periodicidad",
  use: "Contexto de uso",
  description: "Descripción del indicador",
  ebv: "VEBs",
  source: "Fuente",
  requirements: "Requerimientos de información para su cálculo",
  externalLink: "Enlace",
} as const;

type CategoryKey = keyof typeof itemInfoCategoriesDictionary;

const renderColumn: { [column: string]: CategoryKey[] } = {
  left: ["target", "scale", "goals", "periodicity"],
  right: ["description", "requirements", "ebv", "use", "source"],
  resume: ["target", "scale"],
};

export function Card({
  item,
  nowOpen,
  expandCard,
}: {
  item: IndicatorsCardInfo;
  nowOpen: string | null;
  expandCard: (itemId: string) => void;
}) {
  const lastUpdate = item.lastUpdate
    ? new Date(item.lastUpdate).toLocaleDateString()
    : null;

  const sanitizedID = StrValidator.sanitizeToURLSlug(item.id);
  const isOpen = sanitizedID === nowOpen;

  return (
    <section
      id={sanitizedID}
      className={cn(
        "@container border border-grey rounded-3xl p-2 scroll-mt-2 col-span-1",
        isOpen && "col-span-full xl:col-span-3 shadow-lg",
      )}
    >
      <header>
        <div className="flex gap-2 items-baseline border-b border-b-grey-light">
          <h3 className="text-2xl pl-4 font-normal text-balance">
            {item.title}
          </h3>

          {item.externalLink && (
            <a
              href={item.externalLink}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:text-primary self-baseline -translate-1"
              title="Ir al enlace"
            >
              <span className="sr-only">Ir al enlace externo</span>
              <SquareArrowOutUpRight className="size-4" aria-hidden="true" />
            </a>
          )}

          <Button
            onClick={() => expandCard(item.id)}
            role="button"
            tabIndex={0}
            size="icon"
            variant="ghost-clean"
            title={isOpen ? "Ampliar" : "Cerrar"}
            className="ml-auto"
          >
            <span className="sr-only">
              {isOpen
                ? "Ampliar información sobre el indicador"
                : "Reducir informacion sobre el indicador"}
            </span>
            {isOpen ? (
              <CircleMinus className="size-6" strokeWidth="1.5" />
            ) : (
              <CirclePlus className="size-6" strokeWidth="1.5" />
            )}
          </Button>
        </div>
      </header>

      <main className="p-4">
        {isOpen ? (
          <>
            {lastUpdate && (
              <div className="text-right">
                <span className="sr-only">última actualización</span>
                <time dateTime={lastUpdate}>{lastUpdate}</time>
              </div>
            )}

            <div className="flex flex-col @[600px]:flex-row gap-0 @[600px]:gap-8">
              <div className="flex-1">
                {renderColumn.left.map((key) => (
                  <RenderItemInfo
                    key={key}
                    category={key}
                    info={item[key]}
                    join={key === "goals" ? "\n" : ", "}
                  />
                ))}
              </div>
              <div className="flex-3">
                {renderColumn.right.map((key) => (
                  <RenderItemInfo
                    key={key}
                    category={key}
                    info={item[key]}
                    join={key === "goals" ? "\n" : ", "}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            {renderColumn.resume.map((key) => (
              <RenderItemInfo
                key={key}
                category={key}
                info={item[key]}
                join={key === "goals" ? "\n" : ", "}
              />
            ))}
          </div>
        )}
      </main>
    </section>
  );
}

function RenderItemInfo({
  category,
  info,
  join,
}: {
  category: CategoryKey;
  info?: string | string[];
  join?: string;
}) {
  if (!info || (Array.isArray(info) && info.length === 0)) {
    return null;
  }

  const title = itemInfoCategoriesDictionary[category];
  const content = Array.isArray(info)
    ? info.join(join)
    : parseSimpleMarkdown(info);

  return (
    <>
      <h4 className="uppercase text-accent text-base! leading-none! my-0!">
        {title}
      </h4>
      <div className="text-base [&>p]:last:mb-0 mb-[2em]">{content}</div>
    </>
  );
}
