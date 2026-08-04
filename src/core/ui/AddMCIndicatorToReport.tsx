import { useState } from "react";
import { ChevronDown, ClipboardPen, ClipboardPlus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { useUserCTX } from "@hooks/UserCTX";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@ui/shadCN/component/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";
import { REPORT_NOTE_MAX_LENGTH } from "@config/monitoring";
import { inputWarnColor } from "@utils/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/shadCN/component/dialog";
import { uiText } from "@ui/addMCIndicatorToReport/layout/uiText";

export function AddMCIndicatorToReport() {
  const { user } = useUserCTX();
  const {
    addSection,
    isLoading,
    hasSections,
    removeReport,
    toggleEditor,
    whyDownload,
    setWhyDownload,
    downloadReport,
  } = useReport();

  const [withNote, setWithNote] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleMainButtonClick = () => {
    if (!withNote) {
      void addSection();
    }
  };

  const handleConfirmNote = async () => {
    setIsPopoverOpen(false);
    await addSection(noteText.trim() ? noteText : undefined);
    setNoteText("");
  };

  return (
    <>
      <ButtonGroup>
        <Popover
          open={withNote && isPopoverOpen}
          onOpenChange={(open) => withNote && setIsPopoverOpen(open)}
        >
          <PopoverTrigger asChild>
            <Button
              disabled={!user || isLoading}
              onClick={handleMainButtonClick}
              variant="outline"
              size="sm"
              title={
                !user
                  ? uiText.addToReportBtn.title.notLogged
                  : uiText.addToReportBtn.title.logged(withNote)
              }
              aria-label={
                !user
                  ? uiText.addToReportBtn.sr.notLogged
                  : uiText.addToReportBtn.sr.logged(withNote)
              }
            >
              {withNote ? <ClipboardPen /> : <ClipboardPlus />}
              {uiText.addToReportBtn.label(isLoading)}
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

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                title="Ver opciones para reportes"
                aria-label="Ver opciones para reportes"
              >
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-50">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {uiText.dropdownMenu.indicatorElements.title}
                </DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={!withNote}
                  onCheckedChange={() => setWithNote(false)}
                >
                  {uiText.dropdownMenu.indicatorElements.addWithoutNoteBtn}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={withNote}
                  onCheckedChange={() => setWithNote(true)}
                >
                  {uiText.dropdownMenu.indicatorElements.addWithNoteBtn}
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {uiText.dropdownMenu.reportElements.title}
                </DropdownMenuLabel>

                <DropdownMenuItem
                  disabled={!hasSections}
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                    toggleEditor(true);
                  }}
                >
                  {uiText.dropdownMenu.reportElements.editBtn}
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={!hasSections}
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                    setIsDownloadDialogOpen(true);
                  }}
                >
                  {uiText.dropdownMenu.reportElements.downloadBtn}
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={!hasSections}
                  className="text-accent"
                  onClick={() => removeReport()}
                >
                  {uiText.dropdownMenu.reportElements.deleteBtn}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </ButtonGroup>

      <Dialog
        open={isDownloadDialogOpen}
        onOpenChange={setIsDownloadDialogOpen}
      >
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            document.body.style.pointerEvents = "";
          }}
          onPointerDownOutside={() => {
            document.body.style.pointerEvents = "";
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-3xl text-primary font-normal">
              {uiText.downloadDialog.title}
            </DialogTitle>
            <DialogDescription className="text-base text-primary max-w-[65ch] text-balance">
              {uiText.downloadDialog.description}
            </DialogDescription>
          </DialogHeader>

          <div>
            <label htmlFor="whyDownload" className="text-primary font-normal">
              {uiText.downloadDialog.input.label}
            </label>
            <InputGroup>
              <TextareaAutosize
                data-slot="input-group-control"
                className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base! transition-[color,box-shadow] outline-none md:text-sm"
                id="whyDownload"
                name="whyDownload"
                placeholder={uiText.downloadDialog.input.placeholder}
                value={whyDownload}
                onChange={(e) => setWhyDownload(e.target.value)}
                maxLength={REPORT_NOTE_MAX_LENGTH}
              />
              <InputGroupAddon
                align="block-end"
                className={`${inputWarnColor(
                  whyDownload,
                  REPORT_NOTE_MAX_LENGTH,
                  0.95,
                )} flex-row-reverse`}
              >
                {whyDownload.length} / {REPORT_NOTE_MAX_LENGTH}
              </InputGroupAddon>
            </InputGroup>
          </div>

          <DialogFooter className="gap-2 justify-between! flex-row-reverse!">
            <Button
              size="sm"
              disabled={whyDownload === ""}
              onClick={() => {
                setIsDownloadDialogOpen(false);
                void downloadReport();
              }}
              title={uiText.downloadDialog.downloadBtn.title}
              aria-label={uiText.downloadDialog.downloadBtn.sr}
            >
              {uiText.downloadDialog.downloadBtn.label}
            </Button>

            <Button
              variant="outline_destructive"
              size="sm"
              onClick={() => setIsDownloadDialogOpen(false)}
              title={uiText.downloadDialog.cancelBtn.title}
              aria-label={uiText.downloadDialog.cancelBtn.sr}
            >
              {uiText.downloadDialog.cancelBtn.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
