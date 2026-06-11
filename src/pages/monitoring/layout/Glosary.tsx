import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@ui/shadCN/component/sidebar";
import { Button } from "@ui/shadCN/component/button";
import { useCallback, useMemo, useState } from "react";
import { definitions } from "pages/monitoring/layout/glosary/definitions";
import { CircleXIcon, RotateCcw, SearchIcon } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { fuzzySearch, hasFilters } from "pages/monitoring/utils/search";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { GLOSARY_FILTER_IS_AND } from "@config/monitoring";

export function Glosary() {
  const { setOpen } = useSidebar();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const categories = useMemo<string[]>(
    () => [...new Set(definitions.map((d) => d.categories).flat())],
    [],
  );

  const getFilteredDefinitions = useCallback(
    () =>
      definitions.filter((definition) =>
        hasFilters(filters, definition.categories, GLOSARY_FILTER_IS_AND),
      ),
    [filters],
  );

  const getMatchedDefinitions = useCallback(() => {
    const sanitizedSearch = search
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();

    return getFilteredDefinitions()
      .filter((definition) =>
        fuzzySearch(
          sanitizedSearch,
          definition.word
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase(),
        ),
      )
      .sort((a, b) => {
        const distanceA = a.word.length - sanitizedSearch.length;
        const distanceB = b.word.length - sanitizedSearch.length;

        return distanceA - distanceB;
      });
  }, [getFilteredDefinitions, search]);

  const renderDefinitions = useMemo<typeof definitions>(() => {
    const filteredDefinitions = getFilteredDefinitions();

    if (!search) {
      return filteredDefinitions;
    }

    return getMatchedDefinitions();
  }, [search, getMatchedDefinitions, getFilteredDefinitions]);

  const handleFilter = (newFilter: string) => {
    if (GLOSARY_FILTER_IS_AND) {
      setFilters((oldFilters) =>
        oldFilters.includes(newFilter)
          ? oldFilters.filter((f) => f !== newFilter)
          : [...oldFilters, newFilter],
      );
    } else {
      setFilters((oldFilter) =>
        oldFilter[0] === newFilter ? [] : [newFilter],
      );
    }
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="inset"
      className="isolate z-10 border-l border-r border-grey p-1"
    >
      <SidebarHeader className="bg-input rounded-lg m-2 border border-primary/30">
        <div className="flex justify-between items-baseline">
          <h3 className="text-primary text-lg font-normal mb-0">Buscador</h3>
          <div>
            <Button
              size="icon"
              title="reiniciar búsqueda"
              variant="ghost"
              onClick={() => {
                setSearch("");
                setFilters([]);
              }}
            >
              <RotateCcw className="size-5" aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              aria-label="Cerrar el glosario"
              title="Ocultar el glosario"
            >
              <CircleXIcon className="size-5" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="inputSearch" className="sr-only">
            Escribe el término que quieres consultar
          </label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="inputSearch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
            />
          </InputGroup>

          <ButtonGroup className="flex w-full *:flex-1 *:h-auto *:text-sm *:whitespace-normal">
            {categories.map((category) => (
              <Button
                variant="outline"
                className={cn(
                  filters.includes(category)
                    ? "bg-primary text-primary-foreground"
                    : "",
                )}
                onClick={() => handleFilter(category)}
              >
                {category}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar-custom py-2 space-y-4">
        <h3 className="sr-only">
          {search || filters.length ? "Términos encontrados" : "Glosario"}
        </h3>

        {renderDefinitions.map((def) => (
          <div
            key={def.word}
            className="mx-2 outline outline-muted rounded-lg hover:shadow-2xl"
          >
            <h4 className="outline outline-muted bg-muted rounded-t-lg px-2 py-1 text-base">
              {def.word}
            </h4>
            <p className="px-4 mb-2 text-sm">{def.definition}</p>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
