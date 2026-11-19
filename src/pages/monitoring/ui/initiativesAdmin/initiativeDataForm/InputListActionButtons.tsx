import { Check, CirclePlus, Trash2, UndoDot } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";

export function InputListActionButtons<T>({
  update,
  handleSave,
  reset,
  handleDiscard,
  disabled,
}: {
  update: T | null;
  handleSave: () => void;
  reset?: () => void;
  handleDiscard?: () => void;
  disabled: boolean;
}) {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button
          onClick={handleSave}
          type="button"
          variant="outline"
          size="icon"
          title={
            update !== null
              ? uiText.initiative.listManager.actionButtons.update
              : uiText.initiative.listManager.actionButtons.save
          }
          disabled={disabled}
        >
          <span className="sr-only">
            {update !== null
              ? uiText.initiative.listManager.actionButtons.update
              : uiText.initiative.listManager.actionButtons.save}
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
            title={uiText.initiative.listManager.actionButtons.undo}
            disabled={disabled}
          >
            <span className="sr-only">
              {uiText.initiative.listManager.actionButtons.undo}
            </span>
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
            title={uiText.initiative.listManager.actionButtons.discard}
            disabled={disabled}
          >
            <span className="sr-only">
              {uiText.initiative.listManager.actionButtons.discard}
            </span>
            <span aria-hidden="true">
              <Trash2 className="size-5" />
            </span>
          </Button>
        </ButtonGroup>
      )}
    </ButtonGroup>
  );
}
