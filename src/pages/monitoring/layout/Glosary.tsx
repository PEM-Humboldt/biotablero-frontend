import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@ui/shadCN/component/sidebar";
import { Button } from "@ui/shadCN/component/button";
import { useMemo, useState } from "react";
import { definitions } from "pages/monitoring/layout/glosary/definitions";
import { LabeledInput } from "@ui/LabeledInput";
import { RotateCcw } from "lucide-react";

export function Glosary() {
  const { setOpen } = useSidebar();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>();

  const filteredDefinitions = useMemo<typeof definitions>(() => {
    const regex = new RegExp(search, "ig");
    return definitions.filter((def) => regex.test(def.word));
  }, [search]);

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="inset"
      className="isolate z-10 p-1  border-l border-r border-grey"
    >
      <SidebarHeader>
        <Button onClick={() => setOpen(false)}>Cerrar glosario</Button>
        <div className="flex gap-2 items-end">
          <LabeledInput
            inputName="searchTerm"
            inputMaxLength={50}
            texts={{
              label: "Buscar",
              placeholder: "Pastos...",
              sr: "Escribe el término que quieres consultar",
            }}
            state={search}
            stateSetter={setSearch}
            validationErrors={[]}
          />
          <Button title="reiniciar búsqueda" onClick={() => setSearch("")}>
            <RotateCcw aria-hidden="true" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="space-y-2">
        {filteredDefinitions.map((def) => (
          <div className="mx-2 border border-muted rounded-lg hover:border-accent">
            <h4 className="bg-muted p-2 rounded-t-lg overflow-hidden">
              {def.word}
            </h4>
            <p className="px-2 mb-2">{def.definition}</p>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
