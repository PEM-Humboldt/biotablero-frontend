import { useState } from "react";
import { Notebook } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@ui/shadCN/component/button";
import { LabeledTextArea } from "@ui/LabeledTextArea";
import { INITIATIVE_USER_FOCUS_AREA_LENGTH } from "@config/monitoring";

import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { updateUserFocusAreaInInitiative } from "pages/monitoring/api/services/user";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { uiText } from "pages/monitoring/outlets/myProfile/layout/uiText";

export function InitiativeFocusAreaForm({
  initiative,
  initialFocusArea,
  onCancel,
  onSaveSuccess,
}: {
  initiative: InitiativeCompleteInfo;
  initialFocusArea: string;
  onCancel: () => void;
  onSaveSuccess: () => void;
}) {
  const { reloadUserInMonitoringData } = useUserInMonitoringCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [focusArea, setFocusArea] = useState(initialFocusArea);

  const handleFocusAreaSave = async () => {
    setIsLoading(true);
    setErrors([]);

    const res = await updateUserFocusAreaInInitiative(initiative.id, focusArea);
    setIsLoading(false);

    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    await reloadUserInMonitoringData();

    toast(uiText.updateFocusAreaForm.toast.title, {
      position: "bottom-right",
      description: uiText.updateFocusAreaForm.toast.description(
        Boolean(initialFocusArea),
        initiative.name,
      ),
      icon: <Notebook className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
    });

    onSaveSuccess();
  };

  return (
    <>
      <LabeledTextArea
        inputName={`focusAreaInput_${initiative.id}`}
        inputMaxLength={INITIATIVE_USER_FOCUS_AREA_LENGTH}
        texts={uiText.updateFocusAreaForm.textArea}
        state={focusArea}
        stateSetter={setFocusArea}
        validationErrors={errors}
      />
      <div className="flex flex-row-reverse gap-2 justify-between">
        <Button
          disabled={isLoading}
          onClick={() => void handleFocusAreaSave()}
          title={uiText.updateFocusAreaForm.saveBtn.title}
          aria-label={uiText.updateFocusAreaForm.saveBtn.sr}
        >
          <span aria-hidden="true">
            {uiText.updateFocusAreaForm.saveBtn.label}
          </span>
        </Button>
        <Button
          disabled={isLoading}
          onClick={onCancel}
          variant="outline_destructive"
          title={uiText.updateFocusAreaForm.cancelBtn.title}
          aria-label={uiText.updateFocusAreaForm.cancelBtn.sr}
        >
          <span aria-hidden="true">
            {uiText.updateFocusAreaForm.cancelBtn.label}
          </span>
        </Button>
      </div>
    </>
  );
}
