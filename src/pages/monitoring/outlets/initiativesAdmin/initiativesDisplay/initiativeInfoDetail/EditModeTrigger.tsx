import { type Dispatch, type SetStateAction } from "react";
import { Button } from "@ui/shadCN/component/button";
import { Pencil, PencilOff } from "lucide-react";

export function EditModeTrigger({
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
      {state ? (
        <>
          Terminar modo de edicion <PencilOff aria-hidden="true" />
        </>
      ) : (
        <>
          Editar <Pencil aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
