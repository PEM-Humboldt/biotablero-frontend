import { Link } from "react-router";
import { useEffect, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  ChevronRight,
} from "lucide-react";

import { INDICATORS_PER_PAGE, LOCALE, TAG_COLORS } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import type { ODataParams } from "@appTypes/odata";
import { TablePager } from "@composites/TablePager";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import { translateTagCategory } from "pages/monitoring/outlets/tagsAdmin/utils/tagCategoryTranslator";

// TODO: Actualizar el componente para cuando Cesar haya realizado los ajustes
// al back y que el objeto del odata contenga Locations e initiativeName

export function SearchOutput() {
  const {
    indicators,
    indicatorsAmount,
    currentPage,
    setCurrentPage,
    setSearchIndicators,
  } = useIndicatorsCTX();

  const [sortDate, setSortDate] = useState(0);
  const [sortName, setSortName] = useState(0);

  useEffect(() => {
    const sortDateStr = ["", "id asc", "id desc"];
    const sortNameStr = ["", "name asc", "name desc"];
    const sortStr = sortNameStr[sortName] + sortDateStr[sortDate];

    setSearchIndicators({ orderby: sortStr as ODataParams["orderby"] });
  }, [sortDate, sortName, setSearchIndicators]);

  return (
    <div className="max-w-[1600px] w-full space-y-4 mx-auto p-8">
      <div className="flex gap-2 items-center">
        <div className="text-primary">
          <span className="font-normal">{indicatorsAmount}</span> indicadores
          encontrados
        </div>
        <ButtonGroup>
          <Button
            variant={sortName === 0 ? "outline" : "default"}
            size="icon-sm"
            onClick={() => {
              setSortDate(0);
              setSortName((old) => (old + 1) % 3);
            }}
          >
            {sortName === 2 ? <ArrowDownAZ /> : <ArrowUpAZ />}
          </Button>
          <Button
            variant={sortDate === 0 ? "outline" : "default"}
            size="icon-sm"
            onClick={() => {
              setSortName(0);
              setSortDate((old) => (old + 1) % 3);
            }}
          >
            {sortDate !== 2 ? <CalendarArrowUp /> : <CalendarArrowDown />}
          </Button>
        </ButtonGroup>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
        {indicators.map((indicator) => {
          const lastUpdate = new Date(
            indicator.versions[indicator.versions.length - 1].creationDate,
          );

          const initiativeLocations = (indicator?.locations ?? [])
            .map((l) => {
              const municipality = l.locality !== null ? `, ${l.locality}` : "";
              const locality = l.locality !== null ? ` - ${l.locality}` : "";

              return `${l.location.parent?.name}${municipality}${locality}`;
            })
            .join(" / ");

          const tagsGrouped = (indicator.tags || []).reduce<
            Record<number, { group: string; tags: string[] }>
          >((all, tag) => {
            if (!all[tag.tag.category.id]) {
              all[tag.tag.category.id] = {
                group: translateTagCategory(tag.tag.category.name),
                tags: [],
              };
            }
            all[tag.tag.category.id].tags.push(tag.tag.name);

            return all;
          }, {});

          return (
            <li
              key={`indicator_card${indicator.id}`}
              className="relative flex flex-col gap-4 bg-background shadow-2xl outline outline-transparent hover:outline-primary rounded-xl overflow-hidden transition-colors duration-300"
            >
              <div className="relative mx-2 p-2">
                <div className="pt-8">
                  <h4 className="text-xl m-0">{indicator.name}</h4>
                  <div className="text-sm/4 mb-0">{indicator.type.name}</div>
                </div>

                <time
                  dateTime={lastUpdate.toISOString()}
                  title="Última actualización del indicador"
                  className="absolute top-0 right-2 text-sm px-2 py-0.5 bg-primary rounded-b text-primary-foreground"
                >
                  {lastUpdate.toLocaleDateString(LOCALE, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <hr className="border-b-0.5 border-grey-light mx-4" />

              <div title="Iniciativa que realizó el indicador" className="px-4">
                <div className="text-base/4 font-normal mb-0">
                  {indicator?.initiativeName ?? "Nombre de la iniciativa"}
                </div>
                <div className="text-sm italic mb-4">
                  {initiativeLocations !== "" ? initiativeLocations : "nombre"}
                </div>

                <div className="flex flex-col m-1 gap-2">
                  {Object.values(tagsGrouped).map((tags, i) => {
                    const colorValues = TAG_COLORS[i % TAG_COLORS.length];
                    const colorSet = `${colorValues.bg} ${colorValues.fg}`;

                    return (
                      <TagsRender
                        key={`tags_${tags.group}_${i}`}
                        tags={tags.tags}
                        srTitle={tags.group}
                        className={cn(colorSet, "font-normal")}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="text-right mt-auto">
                <hr className="border-b-0.5 border-grey-light mx-4" />

                <Button
                  variant="ghost-clean"
                  className="mb-2 mt-1 self-end"
                  asChild
                >
                  <Link
                    to={`/Monitoreo/Iniciativas/${indicator.initiativeId}/Indicadores/${indicator.id}`}
                  >
                    Ver el indicador <ChevronRight />
                  </Link>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <TablePager
        currentPage={currentPage}
        recordsAvailable={indicatorsAmount}
        onPageChange={setCurrentPage}
        recordsPerPage={INDICATORS_PER_PAGE}
        paginated={5}
        className="py-4"
      />
    </div>
  );
}
