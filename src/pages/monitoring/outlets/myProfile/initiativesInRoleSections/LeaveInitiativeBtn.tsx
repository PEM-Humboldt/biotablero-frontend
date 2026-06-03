import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";

import { leaveInitiative } from "pages/monitoring/api/services/initiatives";
import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { UserInInitiative } from "pages/monitoring/types/odataResponse";
import { useUserCTX } from "@hooks/UserContext";

export function LeaveInitiativeBtn({
  initiative,
}: {
  initiative: UserInInitiative;
}) {
  const { user } = useUserCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userInInitiativeId = useMemo(
    () => initiative.users.find((u) => u.userName === user?.username)?.id,
    [initiative.users, user?.username],
  );

  const handelLeaveInitiative = async () => {
    if (!userInInitiativeId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await leaveInitiative(userInInitiativeId);

    if (isMonitoringAPIError(res)) {
      setError(res.data[0].msg);
      setIsLoading(false);
      return;
    }

    toast(uiText.leaveInitiative.toast.title, {
      position: "bottom-right",
      description: uiText.leaveInitiative.toast.description(initiative.name),
      icon: (
        <uiText.leaveInitiative.toast.icon className="size-8 text-accent" />
      ),
      className: "px-6! gap-6! border-2! border-accent!",
      duration: uiText.leaveInitiative.toast.durationInSeconds * 1000,
    });
    setIsLoading(false);
  };

  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}
      <DestructiveConfirmationDialog
        texts={{
          trigger: uiText.leaveInitiative.alert.trigger,
          dialog: {
            title: uiText.leaveInitiative.alert.dialog.title(initiative.name),
            description: uiText.leaveInitiative.alert.dialog.description,
          },
          actionBtns: uiText.leaveInitiative.alert.actionBtns,
        }}
        triggerBtnVariant="outline_destructive"
        handler={() => void handelLeaveInitiative()}
        isLoading={isLoading}
        isDisabled={error !== null}
      />
    </>
  );
}
