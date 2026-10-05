import type { IndicatorSection, SearchSection } from "@appTypes/report";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import { useReport } from "@hooks/useReport";
import {
  ChartBar,
  ChevronDownCircle,
  ChevronUpCircle,
  FileSearchCorner,
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
import { REPORT_NOTE_MAX_LENGTH } from "@config/report";
import { inputWarnColor } from "@utils/ui";
import { motion, AnimatePresence } from "motion/react";
import { uiText } from "@hooks/useReport/layout/uiText";

export function ReportDocumentTree({
  documentSections,
}: {
  documentSections: Map<string, SearchSection | IndicatorSection>;
}) {
  return documentSections.size === 0 ? (
    <div className="flex flex-col gap-4 items-center h-full p-8 m-4 text-center font-normal text-3xl text-primary">
      {uiText.documentTree.noData}
      <FileSearchCorner className="size-20 text-accent" strokeWidth={1} />
    </div>
  ) : (
    <div className="flex flex-col gap-4 px-4">
      <AnimatePresence mode="popLayout">
        {[...documentSections.entries()].map(
          ([sectionId, value], sectionIdx, { length: sectionsLength }) => {
            const [name, indicatorType, version] = sectionId.split("_");

            return (
              <motion.section
                key={sectionId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="bg-background border border-input hover:border-primary rounded-lg overflow-hidden group"
              >
                <div className="flex gap-2 py-2 px-4 justify-between items-center group-hover:bg-primary">
                  <header className="space-y-0.5 text-primary!">
                    <h3 className="m-0 font-normal text-lg group-hover:text-primary-foreground">
                      {name}
                    </h3>
                    <p className="text-sm italic m-0 group-hover:text-primary-foreground">
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
                  aria-labelledby={uiText.documentTree.section.graphListSr}
                  className="flex flex-col list-none"
                >
                  <AnimatePresence mode="popLayout">
                    {value.graphs.map(
                      (graph, graphIdx, { length: graphsLength }) => {
                        const graphLabelId = `graph-title-${graph.id}`;

                        return (
                          <motion.li
                            key={graph.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 25,
                            }}
                            aria-labelledby={graphLabelId}
                            className="py-2 px-4 bg-transparent border-t border-t-input hover:bg-input"
                          >
                            <div className="flex gap-2 min-w-0 justify-between items-center">
                              <span
                                id={graphLabelId}
                                className="text-base text-foreground truncate"
                              >
                                {uiText.documentTree.section.graphTitle(
                                  graph.id,
                                )}
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
                                aria-label={uiText.documentTree.section.noteSr(
                                  graph.id,
                                )}
                              >
                                "{graph.userNote}"
                              </p>
                            )}
                          </motion.li>
                        );
                      },
                    )}
                  </AnimatePresence>
                </ul>
              </motion.section>
            );
          },
        )}
      </AnimatePresence>
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
              <Button
                variant="outline"
                size="sm"
                title={uiText.documentTree.edition.graph.previewBtn.title}
                aria-label={uiText.documentTree.edition.graph.previewBtn.sr}
              >
                {uiText.documentTree.edition.graph.previewBtn.label}
                <ChartBar />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-auto p-2 bg-muted hover:bg-input rounded-xl transition-colors duration-300"
            >
              <a
                href={graphUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg"
                title={uiText.documentTree.edition.graph.zoomHrefTitle}
              >
                <img
                  src={graphUrl}
                  alt={uiText.documentTree.edition.graph.zoomImgAlt}
                  className="max-w-xs max-h-60 object-contain p-1 bg-background transition-transform"
                />
              </a>
            </PopoverContent>
          </Popover>
        )}

        {mapUrl && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                title={uiText.documentTree.edition.map.previewBtn.title}
                aria-label={uiText.documentTree.edition.map.previewBtn.sr}
              >
                {uiText.documentTree.edition.map.previewBtn.label}
                <MapIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-auto p-2 bg-muted hover:bg-input rounded-xl transition-colors duration-300"
            >
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg"
                title={uiText.documentTree.edition.map.zoomHrefTitle}
              >
                <img
                  src={mapUrl}
                  alt={uiText.documentTree.edition.map.zoomImgAlt}
                  className="max-w-xs max-h-60 object-contain p-1 bg-background transition-transform"
                />
              </a>
            </PopoverContent>
          </Popover>
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
                title={uiText.documentTree.edition.note.editBtn.title(
                  Boolean(userNote),
                )}
                aria-label={uiText.documentTree.edition.note.editBtn.title(
                  Boolean(userNote),
                )}
              >
                {uiText.documentTree.edition.note.editBtn.label}
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
                  placeholder={
                    uiText.documentTree.edition.note.input.placeholder
                  }
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  maxLength={REPORT_NOTE_MAX_LENGTH}
                />
                <InputGroupAddon
                  align="block-end"
                  className={`${inputWarnColor(
                    noteText,
                    REPORT_NOTE_MAX_LENGTH,
                    0.95,
                  )} flex-row-reverse`}
                >
                  {noteText.length} / {REPORT_NOTE_MAX_LENGTH}
                </InputGroupAddon>
              </InputGroup>

              <div className="flex justify-between gap-2">
                <Button
                  variant="outline_destructive"
                  size="sm"
                  onClick={() => setIsPopoverOpen(false)}
                  title={uiText.documentTree.edition.note.input.saveBtn.title}
                  aria-label={uiText.documentTree.edition.note.input.saveBtn.sr}
                >
                  {uiText.documentTree.edition.note.input.saveBtn.label}
                </Button>
                <Button
                  size="sm"
                  onClick={() => void handleConfirmNote()}
                  title={uiText.documentTree.edition.note.input.cancelBtn.title}
                  aria-label={
                    uiText.documentTree.edition.note.input.cancelBtn.sr
                  }
                >
                  {uiText.documentTree.edition.note.input.cancelBtn.label}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </ButtonGroup>

      {(position > 0 || position < total - 1) && (
        <ButtonGroup>
          {position > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveElement("prev", sectionId, graphId)}
              title={uiText.documentTree.edition.order.moveUp.title}
              aria-label={uiText.documentTree.edition.order.moveUp.sr}
            >
              {uiText.documentTree.edition.order.moveUp.label}
              <ChevronUpCircle />
            </Button>
          )}

          {position < total - 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveElement("next", sectionId, graphId)}
              title={uiText.documentTree.edition.order.moveDown.title}
              aria-label={uiText.documentTree.edition.order.moveDown.sr}
            >
              {uiText.documentTree.edition.order.moveDown.label}
              <ChevronDownCircle />
            </Button>
          )}
        </ButtonGroup>
      )}

      <Button
        variant="outline_destructive"
        size="sm"
        onClick={() =>
          graphId ? removeGraph(sectionId, graphId) : removeSection(sectionId)
        }
        title={uiText.documentTree.edition.order.remove.title(Boolean(graphId))}
        aria-label={uiText.documentTree.edition.order.remove.sr(
          Boolean(graphId),
        )}
      >
        {uiText.documentTree.edition.order.remove.label}
        <Trash2Icon />
      </Button>
    </div>
  );
}
