import {
  ChevronDown,
  ClipboardPen,
  ClipboardPlus,
  Ellipsis,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { useUserCTX } from "@hooks/UserCTX";
import { useState } from "react";
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

export function AddMCIndicatorToReport() {
  const { user } = useUserCTX();
  const {
    addSection,
    isLoading,
    removeCurrentSection,
    removeReport,
    toggleEditor,
    openReportInNewTab,
  } = useReport();

  const [withNote, setWithNote] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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

              <DropdownMenuItem onClick={() => void openReportInNewTab()}>
                Ver
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  console.log("descargar");
                }}
              >
                Descargar
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-accent"
                onClick={() => {
                  console.log("a");
                  removeCurrentSection();
                }}
              >
                Borrar este indicador
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-accent"
                onClick={() => {
                  console.log("b");
                  removeReport();
                }}
              >
                Borrar todo el reporte
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ButtonGroup>
  );
}
