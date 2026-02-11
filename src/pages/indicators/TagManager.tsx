import { useEffect, useState } from "react";
import { Dot, CircleMinus, CircleX } from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@ui/shadCN/component/accordion";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  useSidebar,
} from "@ui/shadCN/component/sidebar";
import { Button } from "@ui/shadCN/component/button";

import "pages/indicators/layout/main.css";
import { useCardTags } from "pages/indicators/hooks/useCardTags";

type TagManagerProps = {
  filterData: (filters: string[]) => void;
};

type TagWithReference = [tag: string, reference: string];
const referenceString = (ref: string, element: string) => `${ref}. ${element}`;

export function TagManager({ filterData }: TagManagerProps) {
  const [selected, setSelected] = useState<TagWithReference[]>([]);
  const { isLoadingTags, tags } = useCardTags();
  const { setOpen } = useSidebar();

  useEffect(() => {
    filterData(selected.map((pair) => pair[0]));
  }, [selected, filterData]);

  const toggleTag = (tag: string, parent: string) => {
    setSelected((prev) => {
      const filtered = prev.filter((item) => item[0] !== tag);

      if (filtered.length === prev.length) {
        filtered.push([tag, parent]);
      }

      return filtered;
    });
  };

  const isTagSelected = (tag: string): boolean => {
    return selected.some((item) => item[0] === tag);
  };

  const isCategorySelected = (reference: string): boolean => {
    return selected.some((item) => item[1] === reference);
  };

  const clearTags = () => {
    setSelected([]);
  };

  const hasTags = tags.size > 0;

  return (
    <Sidebar collapsible="offcanvas" className="bg-primary border-primary">
      <SidebarHeader>
        <Button
          onClick={() => setOpen(false)}
          title="Ocultar selector"
          size="lg"
          variant="link"
          className="text-xl justify-start px-2! text-primary-foreground hover:text-primary-foreground font-normal"
        >
          <CircleMinus className="size-6" />
          Filtros
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <Accordion type="single" collapsible className="">
          {Array.from(tags).map(([title, list], idx) => {
            // NOTE:Generates a letter for referencig the tags group
            const reference = String.fromCharCode(97 + idx);

            return (
              <AccordionItem
                value={title}
                key={title}
                className="rounded-none border-none! outline-none!"
              >
                <AccordionTrigger className="gap-0 py-3 items-center rounded-none bg-grey-light hover:bg-blue-800 hover:underline border-b border-b-background">
                  {referenceString(reference, title)}
                  {isCategorySelected(reference) && <Dot className="mr-auto" />}
                </AccordionTrigger>
                <AccordionContent className="py-4">
                  {list.map((tag) => (
                    <label key={tag} className="flex gap-2">
                      <input
                        type="checkbox"
                        value={tag}
                        checked={isTagSelected(tag)}
                        onChange={() => toggleTag(tag, reference)}
                      />
                      {tag}
                    </label>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {selected.length > 0 && (
          <Button
            title="Limpiar filtros"
            type="button"
            variant="link"
            className="px-4! mt-2 justify-start hover:text-primary-foreground text-primary-foreground"
            onClick={clearTags}
          >
            <CircleX className="size-4" />
            Borrar{" "}
            {`${selected.length} filtro${selected.length > 1 ? "s" : ""}`}
          </Button>
        )}

        {isLoadingTags && <p>Cargando filtros...</p>}
        {!isLoadingTags && !hasTags ? (
          <p>No hay filtros disponibles</p>
        ) : (
          <div></div>
        )}

        <div className="flex flex-wrap gap-2 px-2">
          <span className="sr-only">Filtros aplicados</span>
          {selected.map(([tag, reference]) => (
            <div
              key={`${tag}-selected`}
              className="px-2 py-1 rounded-lg text-sm bg-grey-light"
            >
              {referenceString(reference, tag)}
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
