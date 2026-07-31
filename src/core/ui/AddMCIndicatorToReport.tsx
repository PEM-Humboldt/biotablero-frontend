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
import { INDICATOR_NOTE_MAX_LENGTH } from "@config/monitoring";
import { inputWarnColor } from "@utils/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/shadCN/component/dialog";

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
                  ? "Inicia sesión para crear reportes"
                  : `Agregar a mi reporte${withNote ? " con anotación" : ""}`
              }
              aria-label="Agregar a mi reporte"
            >
              {withNote ? <ClipboardPen /> : <ClipboardPlus />}
              {isLoading ? "Agregando..." : "Agregar"}
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
              <Button
                size="sm"
                disabled={isLoading}
                onClick={() => void handleConfirmNote()}
              >
                {isLoading ? "Guardando..." : "Guardar"}
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
                <DropdownMenuLabel>Indicador</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={!withNote}
                  onCheckedChange={() => setWithNote(false)}
                >
                  Agregar sin anotación
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={withNote}
                  onCheckedChange={() => setWithNote(true)}
                >
                  Agregar con anotación
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel>Reporte</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => toggleEditor(true)}>
                  Editar
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={!hasSections}
                  onClick={() => setIsDownloadDialogOpen(true)}
                >
                  Descargar
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-accent"
                  onClick={() => removeReport()}
                >
                  Borrar
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
              Motivo de descarga
            </DialogTitle>
            <DialogDescription className="text-base text-primary max-w-[65ch] text-balance">
              Para el Instituto Humboldt es muy importante saber el uso que se
              le va a dar a la información obtenida BioTablero.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label htmlFor="whyDownload" className="text-primary font-normal">
              ¿Cuál es el objetivo de este reporte que estás creando?
            </label>
            <InputGroup>
              <TextareaAutosize
                data-slot="input-group-control"
                className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base! transition-[color,box-shadow] outline-none md:text-sm"
                id="whyDownload"
                name="whyDownload"
                placeholder="Estoy creando este reporte para..."
                value={whyDownload}
                onChange={(e) => setWhyDownload(e.target.value)}
                maxLength={INDICATOR_NOTE_MAX_LENGTH}
              />
              <InputGroupAddon
                align="block-end"
                className={`${inputWarnColor(
                  whyDownload,
                  INDICATOR_NOTE_MAX_LENGTH,
                  0.95,
                )} flex-row-reverse`}
              >
                {whyDownload.length} / {INDICATOR_NOTE_MAX_LENGTH}
              </InputGroupAddon>
            </InputGroup>
          </div>

          <DialogFooter className="">
            <Button
              variant="outline_destructive"
              size="sm"
              onClick={() => setIsDownloadDialogOpen(false)}
            >
              Cancelar
            </Button>

            <Button
              size="sm"
              disabled={whyDownload === ""}
              onClick={() => {
                setIsDownloadDialogOpen(false);
                void downloadReport();
              }}
            >
              Descargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
