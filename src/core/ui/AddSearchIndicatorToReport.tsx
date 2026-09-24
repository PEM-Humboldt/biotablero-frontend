import { useState } from "react";
import { ClipboardPlus, FilePlus2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";
import { useUserCTX } from "@hooks/UserCTX";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";
import { REPORT_NOTE_MAX_LENGTH } from "@config/report";
import { inputWarnColor } from "@utils/ui";
import { uiText } from "@ui/addMCIndicatorToReport/layout/uiText";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";

export function AddSearchIndicatorToReportBtn({
  wrapperId,
  inButtonGroup = false,
}: {
  wrapperId: string;
  inButtonGroup?: boolean;
}) {
  const { addSectionFromRegistryToReport, isLoading } = useReport();
  const { user } = useUserCTX();
  const dispatchSearchMap = useSearchDispatchCTX();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleConfirmNote = async () => {
    setIsPopoverOpen(false);
    await addSectionFromRegistryToReport(
      wrapperId,
      noteText.trim() ? noteText : "",
    );
    setNoteText("");
  };

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={(open) => setIsPopoverOpen(open)}
    >
      <PopoverTrigger
        onClick={() =>
          dispatchSearchMap({
            type: SearchUpdated.RECENTER_MAP,
          })
        }
        asChild
      >
        {inButtonGroup ? (
          <button
            disabled={!user || isLoading}
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
            <FilePlus2 className="mr-2 mb-1" strokeWidth={2} />
          </button>
        ) : (
          <Button
            disabled={!user || isLoading}
            variant="outline"
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
            {uiText.addToReportBtn.label(isLoading)}
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-2 space-y-2 rounded-xl bg-muted"
      >
        <label htmlFor="description" className="font-normal text-primary">
          {uiText.addToReportBtn.label(isLoading)}
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
  );
}
