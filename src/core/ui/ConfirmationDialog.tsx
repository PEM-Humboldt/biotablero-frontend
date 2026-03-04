import { type LucideIcon } from "lucide-react";

import { type ButtonProps, Button } from "@ui/shadCN/component/button";
import { Spinner } from "@ui/shadCN/component/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@ui/shadCN/component/dialog";

type ConfirmationDialogProps = {
  texts: {
    trigger: { title?: string; sr?: string; label: string; icon?: LucideIcon };
    dialog: { title: string; description: string };
    actionBtns?: { confirm?: string; cancel?: string };
  };
  triggerBtnVariant?: ButtonProps["variant"];
  handler: () => void;
  isLoading?: boolean;
};

export function ConfirmationDialog({
  texts,
  triggerBtnVariant,
  handler,
  isLoading,
}: ConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={triggerBtnVariant}
          title={texts.trigger.title ?? texts.trigger.label}
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          {texts.trigger.sr && (
            <span className="sr-only">{texts.trigger.sr}</span>
          )}
          {texts.trigger.label}
          {texts.trigger.icon && <texts.trigger.icon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{texts.dialog.title}</DialogTitle>
          <DialogDescription className="text-center mt-2 pt-2 border-t border-foreground/20">
            {texts.dialog.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {texts.actionBtns?.cancel ?? "Cancelar"}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={handler}>
              {texts.actionBtns?.confirm ?? "Confirmar"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
