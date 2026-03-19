import { useEffect, useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/shadCN/component/alert-dialog";
import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";
import type {
  TagDataForm,
  TagDataFormErr,
} from "pages/monitoring/types/tagData";
import { makeInitialInfo } from "pages/monitoring/outlets/tagsAdmin/utils/formObjectUpdate";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { toast } from "sonner";
import { UserRoundCheck } from "lucide-react";
import type { ApiRequestError } from "@appTypes/api";
import { getTagById } from "pages/monitoring/api/services/tags";

export function TagDeleteButton({
  value: tagId,
  onActionSuccess,
  deleteTagAction,
}: {
  value: number;
  onActionSuccess: () => void;
  deleteTagAction: (id: number) => () => Promise<ApiRequestError | TagDataForm>;
}) {
  const [loadStatusMsg, setLoadStatusMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<TagDataForm>(makeInitialInfo());
  const [errors, setErrors] = useState<Partial<TagDataFormErr>>({});
  const [openDialogAlert, setOpenDialogAlert] = useState(false);

  const getTag = async () => {
    handleFormReset();
    setLoadStatusMsg(uiText.table.loadStatus.loading);
    const result = await getTagById(tagId);

    if (isMonitoringAPIError(result)) {
      setErrors({ root: [result.message] });
      return;
    }

    setFormData(result);
    setLoadStatusMsg(uiText.table.loadStatus.loaded);
  };

  useEffect(() => {
    if (openDialogAlert) {
      void getTag();
    } else {
      handleFormReset();
    }
  }, [openDialogAlert]);

  const handleFormReset = () => {
    setFormData(makeInitialInfo());
    setErrors({});
  };

  const removeTag = async () => {
    if (tagId) {
      setLoadStatusMsg(uiText.table.loadStatus.loading);
      
      const res = await deleteTagAction(tagId)();

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
      <AlertDialog open={openDialogAlert} onOpenChange={setOpenDialogAlert}>
        <AlertDialogTrigger asChild>
          <Button
            disabled={loadStatusMsg !== null}
            variant="ghost"
          >
            {loadStatusMsg !== null
              ? loadStatusMsg
              : uiText.table.deleteBtn.defaultText}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-h-[80vh] max-w-[60vh] flex flex-col p-4 md:p-8 overflow-hidden">
          <div className="pb-2">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {uiText.table.deleteBtn.dialog.title}
              </AlertDialogTitle>
            </AlertDialogHeader>
          </div>
          <AlertDialogDescription className="grid grid-cols-1 gap-6 [&>p]:m-0 [&>p]:flex [&>p]:flex-col [&>p>span]:first:font-semibold [&>p>span]:first:text-primary">
            <>
              {uiText.table.deleteBtn.dialog.description(formData.name)}
              <ErrorsList
                errorItems={errors.root ?? []}
                className="bg-red-50 p-4 mt-2 rounded-lg outline-2 outline-accent"
              />
            </>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">
                {uiText.table.deleteBtn.actionBtns.cancel}
              </Button>
            </AlertDialogCancel>
            <Button onClick={() => void removeTag()}>
              {uiText.table.deleteBtn.actionBtns.confirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
