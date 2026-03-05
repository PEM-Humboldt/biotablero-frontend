import { type Dispatch, type SetStateAction } from "react";
import { Pencil, PencilOff } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";

import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";

export function EditModeButton({
  state,
  setState,
}: {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Button
      type="button"
      variant={state ? "outline_destructive" : "ghost-clean"}
      onClick={() => setState((s) => !s)}
      size="icon-sm"
      title={
        state
          ? uiText.initiative.editMode.end
          : uiText.initiative.editMode.start
      }
    >
      <span className="sr-only">
        {state
          ? uiText.initiative.editMode.end
          : uiText.initiative.editMode.start}
      </span>
      {state ? <PencilOff aria-hidden="true" /> : <Pencil aria-hidden="true" />}
    </Button>
  );
}
