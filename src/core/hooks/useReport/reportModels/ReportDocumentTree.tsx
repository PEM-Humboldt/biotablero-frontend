import type { IndicatorSection, SearchSection } from "@appTypes/report";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import { useReport } from "@hooks/useReport";
import {
  ChartBar,
  ChevronDownCircle,
  ChevronUpCircle,
  MapIcon,
  SquarePen,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";
import TextareaAutosize from "react-textarea-autosize";
import { INDICATOR_NOTE_MAX_LENGTH } from "@config/monitoring";
import { inputWarnColor } from "@utils/ui";

export function ReportDocumentTree({
  documentSections,
}: {
  documentSections: Map<string, SearchSection | IndicatorSection>;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[...documentSections.entries()].map(
        ([sectionId, value], sectionIdx, { length: sectionsLength }) => {
          const [name, indicatorType, version] = sectionId.split("_");

          return (
            <section
              key={sectionId}
              className="bg-background border border-input hover:border-primary hover:[&>div]:first:bg-muted rounded-lg transition-colors duration-300 overflow-hidden"
            >
              <div className="flex gap-2 p-2 justify-between items-center">
                <header className="space-y-0.5 text-primary!">
                  <h3 className="m-0 font-normal text-lg">{name}</h3>
                  <p className="text-sm italic truncate m-0">
                    {indicatorType} • Versión: {version}
                  </p>
                </header>

                <DocEdit
                  sectionId={sectionId}
                  position={sectionIdx}
                  total={sectionsLength}
                />
              </div>

              <ul
                aria-labelledby="Gráficos de esta sección"
                className="flex flex-col list-none"
              >
                {value.graphs.map(
                  (graph, graphIdx, { length: graphsLength }) => {
                    const graphLabelId = `graph-title-${graph.id}`;

                    return (
                      <li
                        key={graph.id}
                        aria-labelledby={graphLabelId}
                        className="p-2 bg-transparent border-t border-t-input hover:bg-input transition-colors duration-300"
                      >
                        <div className="flex gap-2 min-w-0 justify-between items-center">
                          <span
                            id={graphLabelId}
                            className="text-base text-foreground truncate"
                          >
                            Gráfica: {graph.id}
                          </span>

                          <DocEdit
                            sectionId={sectionId}
                            graphId={graph.id}
                            graphUrl={graph.blobUrl}
                            mapUrl={graph.mapUrl}
                            position={graphIdx}
                            total={graphsLength}
                            userNote={graph.userNote}
                          />
                        </div>

                        {graph.userNote && (
                          <p
                            className="line-clamp-2 m-0 ml-8 rounded"
                            aria-label={`Nota sobre la gráfica ${graph.id}`}
                          >
                            "{graph.userNote}"
                          </p>
                        )}
                      </li>
                    );
                  },
                )}
              </ul>
            </section>
          );
        },
      )}
    </div>
  );
}

function DocEdit({
  sectionId,
  graphId,
  position,
  total,
  graphUrl,
  mapUrl,
  userNote,
}: {
  sectionId: string;
  graphId?: string;
  position: number;
  total: number;
  graphUrl?: string;
  mapUrl?: string;
  userNote?: string;
}) {
  const { moveElement, removeGraph, removeSection, updateNote } = useReport();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [noteText, setNoteText] = useState(userNote ?? "");

  const handleConfirmNote = () => {
    if (!graphId) {
      return;
    }
    setIsPopoverOpen(false);
    updateNote(sectionId, graphId, noteText !== "" ? noteText : undefined);
    setNoteText("");
  };

  return (
    <div className="shrink-0 flex gap-2">
      <ButtonGroup>
        {graphUrl && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" title="Vista previa gráfica">
                <ChartBar />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-auto p-1.5 rounded-xl">
              <a
                href={graphUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg group"
                title="Haz clic para abrir a tamaño completo"
              >
                <img
                  src={graphUrl}
                  alt="Vista previa gráfica"
                  className="max-w-xs max-h-60 object-contain transition-transform group-hover:scale-[1.02]"
                />
              </a>
            </PopoverContent>
          </Popover>
        )}

        {mapUrl && (
          <Button asChild>
            <a href={mapUrl} target="_blank">
              <MapIcon />
            </a>
          </Button>
        )}

        {graphId && (
          <Popover
            open={isPopoverOpen}
            onOpenChange={(open) => setIsPopoverOpen(open)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                title={userNote ? "Actualizar nota" : "Agregar nota"}
                aria-label="Agregar a mi reporte"
              >
                <SquarePen />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-80 p-2 space-y-2 rounded-xl bg-muted"
            >
              <InputGroup>
                <TextareaAutosize
                  data-slot="input-group-control"
                  className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                  id="description"
                  name="description"
                  placeholder="Mis observaciones..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  maxLength={INDICATOR_NOTE_MAX_LENGTH}
                />
                <InputGroupAddon
                  align="block-end"
                  className={`${inputWarnColor(
                    noteText,
                    INDICATOR_NOTE_MAX_LENGTH,
                    0.95,
                  )} flex-row-reverse`}
                >
                  {noteText.length} / {INDICATOR_NOTE_MAX_LENGTH}
                </InputGroupAddon>
              </InputGroup>

              <div className="flex justify-between gap-2">
                <Button
                  variant="outline_destructive"
                  size="sm"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  Cancelar
                </Button>
                <Button size="sm" onClick={() => void handleConfirmNote()}>
                  Guardar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </ButtonGroup>

      <ButtonGroup>
        {position > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveElement("prev", sectionId, graphId)}
          >
            <ChevronUpCircle />
          </Button>
        )}

        {position < total - 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveElement("next", sectionId, graphId)}
          >
            <ChevronDownCircle />
          </Button>
        )}
      </ButtonGroup>

      <Button
        variant="outline_destructive"
        size="sm"
        onClick={() =>
          graphId ? removeGraph(sectionId, graphId) : removeSection(sectionId)
        }
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
