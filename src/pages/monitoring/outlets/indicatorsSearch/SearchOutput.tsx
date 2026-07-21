import { TablePager } from "@composites/TablePager";
import { INDICATORS_PER_PAGE, LOCALE, TAG_COLORS } from "@config/monitoring";
import { ChevronRight } from "lucide-react";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { Button } from "@ui/shadCN/component/button";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import { cn } from "@ui/shadCN/lib/utils";

// TODO: Actualizar el componente para cuando Cesar haya actualizado
// al back y que el objeto del odata contenga Locations e initiativeName

export function SearchOutput() {
  const { indicators, indicatorsAmount, currentPage, setCurrentPage } =
    useIndicatorsCTX();

  return (
    <div className="max-w-[1600px] w-full space-y-4 mx-auto">
      <div>{indicatorsAmount} indicadores encontrados</div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4 p-4">
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
            Record<number, string[]>
          >((all, tag) => {
            if (!all[tag.tag.category.id]) {
              all[tag.tag.category.id] = [];
            }
            all[tag.tag.category.id].push(tag.tag.name);

            return all;
          }, {});

          return (
            <li
              key={`indicator_card${indicator.id}`}
              className="relative flex flex-col gap-4 bg-background shadow-2xl outline outline-transparent hover:outline-primary rounded-xl overflow-hidden transition-colors duration-300"
            >
              <div className="relative mx-2 p-2">
                <div className="pt-8">
                  <h4 className="m-0">{indicator.name}</h4>
                  <div className="text-sm/4 mb-0">{indicator.type.name}</div>
                </div>

                <time
                  dateTime=""
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
                <div className="text-sm font-normal italic mb-4">
                  {initiativeLocations !== "" ? initiativeLocations : "nombre"}
                </div>

                <div className="flex m-1 gap-2">
                  {Object.values(tagsGrouped).map((group, i) => {
                    const colorValues = TAG_COLORS[i % TAG_COLORS.length];
                    const colorSet = `${colorValues.bg} ${colorValues.fg}`;

                    return (
                      <TagsRender
                        key={`tags_${group[i]}_${i}`}
                        tags={group}
                        srTitle="Etiquetas 1"
                        className={cn(colorSet, "font-normal")}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="text-right pb-2">
                <hr className="border-b-0.5 border-grey-light mx-4 mt-auto" />

                <Button variant="ghost-clean" className=" self-end">
                  Ver el indicador <ChevronRight />{" "}
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
      />
    </div>
  );
}
