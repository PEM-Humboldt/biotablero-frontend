import { type Dispatch, type SetStateAction } from "react";
import { Button } from "@ui/shadCN/component/button";
import { Pencil, PencilOff } from "lucide-react";

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
      title={state ? "Terminar edición" : "Editar"}
    >
      <span className="sr-only">{state ? "Terminar edición" : "Editar"}</span>
      {state ? <PencilOff aria-hidden="true" /> : <Pencil aria-hidden="true" />}
    </Button>
  );
}
