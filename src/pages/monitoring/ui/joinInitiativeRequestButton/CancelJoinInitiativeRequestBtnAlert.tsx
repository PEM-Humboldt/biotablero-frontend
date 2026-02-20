import { useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import {
  cancelJoinRequestToInitiative,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";

export function CancelJoinInitiativeRequestBtnAlert() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInInitiativeInfo, initiativeInfo, userStateInInitiative } =
    useInitiativeCTX();

  const handleCancelRequest = async () => {
    if (
      !initiativeInfo ||
      !userInInitiativeInfo ||
      userStateInInitiative !== UserStateInInitiative.USER_ASPIRING
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const cancelRequest = await cancelJoinRequestToInitiative(
        userInInitiativeInfo.id,
      );

      if (isMonitoringAPIError(cancelRequest)) {
        setError(cancelRequest);
        return;
      }

      toast(uiText.cancelJoinRequestToInitiative.toast.title, {
        position: "bottom-right",
        description: uiText.cancelJoinRequestToInitiative.toast.description(
          initiativeInfo?.name ?? "",
        ),
        icon: (
          <uiText.cancelJoinRequestToInitiative.toast.icon className="size-8 text-accent" />
        ),
        className: "px-6! gap-6! border-2! border-accent!",
        duration:
          uiText.cancelJoinRequestToInitiative.toast.durationInSeconds * 1000,
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
          trigger: uiText.cancelJoinRequestToInitiative.alert.trigger,
          dialog: {
            title: uiText.cancelJoinRequestToInitiative.alert.dialog.title(
              initiativeInfo?.name ?? "",
            ),
            description:
              uiText.cancelJoinRequestToInitiative.alert.dialog.description,
          },
          actionBtns: uiText.cancelJoinRequestToInitiative.alert.actionBtns,
        }}
        triggerBtnVariant="outline_destructive"
        handler={() => void handleCancelRequest()}
        isLoading={isLoading}
      />
    </>
  );
}
