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

import { uiText } from "pages/monitoring/outlets/initiativesAdmin/layout/uiText";

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
          title={
            active
              ? uiText.initiative.module.status.disable
              : uiText.initiative.module.status.enable
          }
        >
          <span className="sr-only">
            {active
              ? uiText.initiative.module.status.disable
              : uiText.initiative.module.status.enable}
          </span>
          {active ? (
            <Eye aria-hidden="true" />
          ) : (
            <EyeClosed aria-hidden="true" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {active
              ? uiText.initiative.module.status.confirmation.disable
              : uiText.initiative.module.status.confirmation.enable}{" "}
            <strong>{name}</strong>,
            <br />
            <strong>
              {uiText.initiative.module.status.confirmation.question}
            </strong>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center mt-2 pt-2 border-t border-foreground/20">
            {active
              ? uiText.initiative.module.status.disclaimer.disable
              : uiText.initiative.module.status.disclaimer.enable}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{uiText.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handler}>
            {uiText.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
