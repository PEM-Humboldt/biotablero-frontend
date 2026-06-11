import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@ui/shadCN/component/sidebar";
import { Button } from "@ui/shadCN/component/button";
import { useMemo, useState } from "react";
import { definitions } from "pages/monitoring/layout/glosary/definitions";
import { RotateCcw, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { fuzzySearch, hasFilters } from "pages/monitoring/utils/search";

export function Glosary() {
  const { setOpen } = useSidebar();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const categories = useMemo<string[]>(
    () => [...new Set(definitions.map((d) => d.categories).flat())],
    [],
  );

  const renderDefinitions = useMemo<typeof definitions>(() => {
    const filteredDefinitions = definitions.filter((definition) =>
      hasFilters(filters, definition.categories),
    );

    if (!search) {
      return filteredDefinitions;
    }

    const sanitizedSearch = search
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();

    return filteredDefinitions
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
  }, [search, filters]);

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="inset"
      className="isolate z-10 p-1  border-l border-r border-grey"
    >
      <SidebarHeader>
        <Button onClick={() => setOpen(false)}>Cerrar glosario</Button>
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
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                title="reiniciar búsqueda"
                variant="ghost-clean"
                onClick={() => setSearch("")}
              >
                <RotateCcw aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <div className="flex gap-2 w-full *:flex-1 *:h-auto *:text-sm *:whitespace-normal">
            {categories.map((category) => (
              <Button
                variant={filters.includes(category) ? "default" : "outline"}
                onClick={() =>
                  setFilters((oldFilters) =>
                    oldFilters.includes(category)
                      ? oldFilters.filter((f) => f !== category)
                      : [...oldFilters, category],
                  )
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="space-y-4">
        {renderDefinitions.map((def) => (
          <div className="mx-2 outline outline-muted hover:border-primary hover:[&>h4]:bg-primary hover:[&>h4]:text-primary-foreground">
            <h4 className="bg-muted px-2 py-1 text-base rounded-t-lg">
              {def.word}
            </h4>
            <p className="px-4 mb-2 text-sm">{def.definition}</p>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
