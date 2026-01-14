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
      variant={state ? "outline_destructive" : "outline"}
      onClick={() => setState((s) => !s)}
    >
      {state ? "Terminar edición" : "Editar"}
      {state ? <PencilOff aria-hidden="true" /> : <Pencil aria-hidden="true" />}
    </Button>
  );
}
