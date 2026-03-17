import { useState } from "react";
import { toast } from "sonner";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { ConfirmationDialog } from "@ui/ConfirmationDialog";

import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { makeJoinRequestToInitiative } from "pages/monitoring/api/services/initiatives";
import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

export function MakeJoinInitiativeRequestBtnDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initiativeInfo, updateInitiative } = useInitiativeCTX();
  const { reloadUserInMonitoringData } = useUserInMonitoringCTX();

  const handleJoinInitiative = async () => {
    if (!initiativeInfo) {
      return;
    }
    setIsLoading(true);

    const joinRequest = await makeJoinRequestToInitiative(
      initiativeInfo.id,
      RoleInInitiative.USER,
    );

    if (isMonitoringAPIError(joinRequest)) {
      setIsLoading(false);
      setError(joinRequest.data[0].msg);
      return;
    }

    await updateInitiative();
    await reloadUserInMonitoringData();

    toast(uiText.makeJoinRequestToInitiative.toast.title, {
      position: "bottom-right",
      description: uiText.makeJoinRequestToInitiative.toast.description(
        initiativeInfo?.name ?? "",
      ),
      icon: (
        <uiText.makeJoinRequestToInitiative.toast.icon className="size-8 text-primary" />
      ),
      className: "px-6! gap-6! border-2! border-primary!",
      duration:
        uiText.makeJoinRequestToInitiative.toast.durationInSeconds * 1000,
    });
    setIsLoading(false);
  };

  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}

      <ConfirmationDialog
        texts={{
          trigger: uiText.makeJoinRequestToInitiative.dialog.trigger,
          dialog: {
            title: uiText.makeJoinRequestToInitiative.dialog.dialog.title(
              initiativeInfo?.name ?? "",
            ),
            description:
              uiText.makeJoinRequestToInitiative.dialog.dialog.description,
          },
          actionBtns: uiText.makeJoinRequestToInitiative.dialog.actionBtns,
        }}
        triggerBtnVariant="default"
        handler={() => void handleJoinInitiative()}
        isLoading={isLoading}
      />
    </>
  );
}
