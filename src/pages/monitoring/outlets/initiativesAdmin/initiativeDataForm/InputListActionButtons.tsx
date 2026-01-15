import { Check, CirclePlus, Trash2, UndoDot } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

export function InputListActionButtons<T>({
  update,
  handleSave,
  reset,
  handleDiscard,
}: {
  update: T | null;
  handleSave: () => void;
  reset?: () => void;
  handleDiscard?: () => void;
}) {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button
          onClick={handleSave}
          type="button"
          variant="outline"
          size="icon"
          title={update !== null ? "Guardar cambios" : "Añadir"}
        >
          <span className="sr-only">
            {update !== null ? "Guardar cambios" : "Añadir"}
          </span>
          <span aria-hidden="true">
            {update !== null ? (
              <Check className="size-5" />
            ) : (
              <CirclePlus className="size-5" />
            )}
          </span>
        </Button>

        {reset && (
          <Button
            onClick={() => void reset()}
            type="button"
            variant="outline"
            size="icon"
            title="Restablecer"
          >
            <span className="sr-only">Restablecer</span>
            <span aria-hidden="true">
              <UndoDot className="size-5" />
            </span>
          </Button>
        )}
      </ButtonGroup>

      {update && (
        <ButtonGroup>
          <Button
            onClick={handleDiscard}
            type="button"
            variant="outline_destructive"
            size="icon"
            title="Desechar"
          >
            <span className="sr-only">Desechar elemento</span>
            <span aria-hidden="true">
              <Trash2 className="size-5" />
            </span>
          </Button>
        </ButtonGroup>
      )}
    </ButtonGroup>
  );
}
