import { useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { leaveInitiative } from "pages/monitoring/api/monitoringAPI";
import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";

export function LeaveInitiativeBtnAlert() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInInitiativeInfo, initiativeInfo, userStateInInitiative } =
    useInitiativeCTX();

  const handelLeaveInitiative = async () => {
    if (
      !initiativeInfo ||
      !userInInitiativeInfo ||
      userStateInInitiative !== UserStateInInitiative.USER_PARTICIPANT
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const errorInResponse = await leaveInitiative(userInInitiativeInfo.id);

      if (errorInResponse) {
        setError(errorInResponse);
        return;
      }

      toast(uiText.leaveInitiative.toast.title, {
        position: "bottom-right",
        description: uiText.leaveInitiative.toast.description(
          initiativeInfo?.name ?? "",
        ),
        icon: (
          <uiText.leaveInitiative.toast.icon className="size-8 text-accent" />
        ),
        className: "px-6! gap-6! border-2! border-accent!",
        duration: uiText.leaveInitiative.toast.durationInSeconds * 1000,
      });
    } catch (err) {
      console.error(err);
      setError(`Error crítico: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}
      <DestructiveConfirmationDialog
        texts={{
          trigger: uiText.leaveInitiative.alert.trigger,
          dialog: {
            title: uiText.leaveInitiative.alert.dialog.title(
              initiativeInfo?.name ?? "",
            ),
            description: uiText.leaveInitiative.alert.dialog.description,
          },
          actionBtns: uiText.leaveInitiative.alert.actionBtns,
        }}
        triggerBtnVariant="outline_destructive"
        handler={() => void handelLeaveInitiative()}
        isLoading={isLoading}
        disabled={Boolean(error)}
      />
    </>
  );
}
