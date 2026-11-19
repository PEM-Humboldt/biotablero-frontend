import { useState } from "react";
import { toast } from "sonner";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { cancelJoinRequestToInitiative } from "pages/monitoring/api/services/initiatives";

import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

export function CancelJoinInitiativeRequestBtnAlert() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { joinRequestsByInitiativeId, reloadUserInMonitoringData } =
    useUserInMonitoringCTX();
  const { initiativeInfo, userStateInInitiative, updateInitiative } =
    useInitiativeCTX();

  const handleCancelRequest = async () => {
    if (
      !initiativeInfo ||
      !joinRequestsByInitiativeId[initiativeInfo.id] ||
      userStateInInitiative !== UserStateInInitiative.USER_ASPIRING
    ) {
      return;
    }

    setIsLoading(true);

    const cancelRequest = await cancelJoinRequestToInitiative(
      joinRequestsByInitiativeId[initiativeInfo.id].id,
    );

    if (isMonitoringAPIError(cancelRequest)) {
      setError(cancelRequest.data[0].msg);
      setIsLoading(false);
      return;
    }

    await updateInitiative();
    await reloadUserInMonitoringData();

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
    setIsLoading(false);
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
