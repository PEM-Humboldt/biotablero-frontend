import { Button } from "@ui/shadCN/component/button";
import { Eye, EyeClosed } from "lucide-react";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/shadCN/component/alert-dialog";

export function InitiativeStatusDialog({
  active,
  name,
  handler,
}: {
  active: boolean;
  name: string;
  handler: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          title={active ? "Desactivar iniciativa" : "Activar iniciativa"}
        >
          <span className="sr-only">
            {active ? "Desactivar iniciativa" : "Activar iniciativa"}
          </span>
          {active ? <Eye /> : <EyeClosed />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {active
              ? "Vas a desactivar la iniciativa"
              : "Vas a reactivar la iniciativa"}{" "}
            <strong>{name}</strong>,
            <br />
            <strong>¿realmente quieres hacerlo?</strong>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center mt-2 pt-2 border-t border-foreground/20">
            {active
              ? "Al desactivarla, la información de esta iniciativa dejará de ser pública. Se perderá el permiso de acceso y edición para quienes tengan perfiles de usuario, participante o administrador."
              : "Al reactivarla, la información de esta iniciativa volverá a ser pública. Las personas que tengan perfil de usuario, participante o administrador de esta iniciativa, volverán a tener permiso de acceso y edición."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handler}>Sí</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
