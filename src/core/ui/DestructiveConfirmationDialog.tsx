import { type ButtonProps, Button } from "@ui/shadCN/component/button";

import { Spinner } from "@ui/shadCN/component/spinner";
import { type LucideIcon } from "lucide-react";
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

export type DestructiveConfirmationDialogProps = {
  texts: {
    trigger: { title?: string; sr?: string; label: string; icon?: LucideIcon };
    dialog: { title: string; description: string };
    actionBtns?: { confirm?: string; cancel?: string };
  };
  triggerBtnVariant?: ButtonProps["variant"];
  triggerBtnSize?: ButtonProps["size"];
  handler: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export function DestructiveConfirmationDialog({
  texts,
  triggerBtnVariant,
  triggerBtnSize,
  handler,
  isLoading,
  isDisabled,
}: DestructiveConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerBtnVariant ?? "default"}
          title={texts.trigger.title ?? texts.trigger.label}
          size={triggerBtnSize ?? "default"}
          disabled={isDisabled || isLoading}
        >
          {isLoading && <Spinner />}
          {texts.trigger.sr && (
            <span className="sr-only">{texts.trigger.sr}</span>
          )}
          {texts.trigger.label}
          {texts.trigger.icon && <texts.trigger.icon />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{texts.dialog.title}</AlertDialogTitle>
          <AlertDialogDescription className="text-left mt-2 pt-2 border-t border-foreground/20">
            {texts.dialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {texts.actionBtns?.cancel ?? "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handler}>
            {texts.actionBtns?.confirm ?? "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
