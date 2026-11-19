import TextareaAutosize from "react-textarea-autosize";
import { ClipboardPlus, FileDown, FolderDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { useReport } from "@hooks/useReport";
import { useUserCTX } from "@hooks/UserCTX";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";
import { REPORT_NOTE_MAX_LENGTH } from "@config/report";
import { StrValidator } from "@utils/strValidator";
import { inputWarnColor } from "@utils/ui";

import { graphDataToCSV } from "pages/monitoring/utils/topicsDataTransformers";
import { uiText } from "pages/monitoring/ui/addMCTopicToReport/layout/uiText";
import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";

export function AddMCTopicToReport() {
  const { user } = useUserCTX();
  const { addSection, isLoading, hasSections, toggleEditor } = useReport();
  const { currentTopic } = useTopicsCTX();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleConfirmNote = async () => {
    setIsPopoverOpen(false);
    await addSection(noteText.trim() ? noteText : undefined);
    setNoteText("");
  };

  const handleSerializeDataDownload = () => {
    if (!currentTopic) {
      return;
    }
    const csvString = graphDataToCSV(currentTopic);

    if (!csvString) {
      return;
    }

    // NOTE: el primer caracter es para que excel no muestre vainas raras con las tildes en el csv
    const blob = new Blob(["\uFEFF" + csvString], {
      type: "text/csv;charset=utf-8;",
    });

    const sanitizedName = StrValidator.sanitizeToURLSlug(
      currentTopic.topicType.name,
    );

    const fileName = `Datos_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.csv`;
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = url;
    link.setAttribute("download", fileName);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap justify-end">
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => setIsPopoverOpen(open)}
      >
        <PopoverTrigger asChild>
          <Button
            disabled={!user || isLoading}
            variant="ghost-clean"
            size="sm"
            title={
              !user
                ? uiText.addToReportBtn.title.notLogged
                : uiText.addToReportBtn.title.logged
            }
            aria-label={
              !user
                ? uiText.addToReportBtn.sr.notLogged
                : uiText.addToReportBtn.sr.logged
            }
          >
            <ClipboardPlus />
            {isLoading
              ? uiText.addToReportBtn.label.loading
              : uiText.addToReportBtn.label.ready}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-80 p-2 space-y-2 rounded-xl bg-muted"
        >
          <label htmlFor="description" className="font-normal text-primary">
            Agrega una nota (Opcional)
          </label>
          <InputGroup className="mt-2">
            <TextareaAutosize
              data-slot="input-group-control"
              className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-sm md:text-base transition-[color,box-shadow] outline-none"
              id="description"
              name="description"
              placeholder={uiText.addNotePopover.placeholder}
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

          <div className="flex flex-row-reverse justify-between gap-2">
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => void handleConfirmNote()}
              title={uiText.addNotePopover.addBtn.title}
              aria-label={uiText.addNotePopover.addBtn.sr}
            >
              {uiText.addNotePopover.addBtn.label(isLoading)}
            </Button>

            <Button
              variant="outline_destructive"
              size="sm"
              onClick={() => setIsPopoverOpen(false)}
              title={uiText.addNotePopover.cancelBtn.title}
              aria-label={uiText.addNotePopover.cancelBtn.sr}
            >
              {uiText.addNotePopover.cancelBtn.label}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        disabled={!hasSections}
        size="sm"
        variant="ghost-clean"
        onClick={() => toggleEditor(true)}
        title={uiText.editReportBtn.title}
        aria-label={uiText.editReportBtn.sr}
      >
        <FileDown />
        {uiText.editReportBtn.label}
      </Button>

      <Button
        size="sm"
        variant="ghost-clean"
        onClick={handleSerializeDataDownload}
        title={uiText.downloadTopicDataBtn.title}
        aria-label={uiText.downloadTopicDataBtn.sr}
      >
        <FolderDown />
        {uiText.downloadTopicDataBtn.label}
      </Button>
    </div>
  );
}
