import { useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/shadCN/component/dialog";
import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";
import type {
  TagDataForm,
  TagDataFormErr,
} from "pages/monitoring/types/tagData";
import { makeInitialInfo } from "pages/monitoring/outlets/tagsAdmin/utils/formObjectUpdate";
import { deleteTag, getTagById } from "pages/monitoring/api/services/tags";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { toast } from "sonner";
import { UserRoundCheck } from "lucide-react";

export function TagDeleteButton({
  value: tagId,
  onActionSuccess,
}: {
  value: number;
  onActionSuccess?: () => void;
}) {
  const [openDialogAlert, setOpenDialogAlert] = useState(false);
  const [loadStatusMsg, setLoadStatusMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<TagDataForm>(makeInitialInfo());
  const [errors, setErrors] = useState<Partial<TagDataFormErr>>({});

  const fetchTag = async () => {
    handleFormReset();
    setLoadStatusMsg(uiText.table.loadStatus.loading);
    const result = await getTagById(tagId);

    if (isMonitoringAPIError(result)) {
      setErrors({ root: [result.message] });
      return;
    }

    setFormData(makeInitialInfo());

    setLoadStatusMsg(uiText.table.loadStatus.loaded);
  };

  const handleFormReset = () => {
    setFormData(makeInitialInfo());
    setErrors({});
  };

  const removeTag = async () => {
    if (tagId) {
      setLoadStatusMsg(uiText.table.loadStatus.loading);
      const res = await deleteTag(tagId);

      if (isMonitoringAPIError(res)) {
        setErrors((oldErr) => ({
          ...oldErr,
          root: res.data.map((error) => error.msg),
        }));
        setLoadStatusMsg(uiText.table.loadStatus.loaded);
        return;
      }

      setLoadStatusMsg(uiText.table.loadStatus.loaded);

      toast(uiText.toast.delete.title, {
        position: "bottom-right",
        description: uiText.toast.delete.description,
        icon: <UserRoundCheck className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });

      setOpenDialogAlert(false);
      onActionSuccess?.();
    }
  };

  return (
    <>
      <Dialog open={openDialogAlert} onOpenChange={setOpenDialogAlert}>
        <DialogTrigger asChild>
          <Button
            onClick={() => void fetchTag()}
            disabled={loadStatusMsg !== null}
            variant="ghost"
          >
            {loadStatusMsg !== null
              ? loadStatusMsg
              : uiText.table.deleteBtn.defaultText}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-[60vh] flex flex-col p-4 md:p-8 overflow-hidden">
          <div className="pb-2">
            <DialogHeader>
              <DialogTitle>{uiText.table.deleteBtn.dialog.title}</DialogTitle>
            </DialogHeader>
          </div>
          <DialogDescription className="grid grid-cols-1 gap-6 [&>p]:m-0 [&>p]:flex [&>p]:flex-col [&>p>span]:first:font-semibold [&>p>span]:first:text-primary">
            <>
              {uiText.table.deleteBtn.dialog.description(formData.name)}
              <ErrorsList
                errorItems={errors.root ?? []}
                className="bg-red-50 p-4 mt-2 rounded-lg outline-2 outline-accent"
              />
            </>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                {uiText.table.deleteBtn.actionBtns.cancel}
              </Button>
            </DialogClose>
            <Button onClick={() => void removeTag()}>
              {uiText.table.deleteBtn.actionBtns.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
