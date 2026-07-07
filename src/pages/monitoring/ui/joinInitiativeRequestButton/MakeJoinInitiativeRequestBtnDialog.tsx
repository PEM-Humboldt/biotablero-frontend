import { useState } from "react";
import { toast } from "sonner";
import { UserRoundPlus } from "lucide-react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { ConfirmationDialog } from "@ui/ConfirmationDialog";
import { Button } from "@ui/shadCN/component/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";

import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { makeJoinRequestToInitiative } from "pages/monitoring/api/services/initiatives";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";

export function MakeJoinInitiativeRequestBtnDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initiativeInfo, updateInitiative } = useInitiativeCTX();
  const { reloadUserInMonitoringData } = useUserInMonitoringCTX();

  const handleJoinInitiative = async (asRole: RoleInInitiative) => {
    if (!initiativeInfo) {
      return;
    }
    setIsLoading(true);

    const joinRequest = await makeJoinRequestToInitiative(
      initiativeInfo.id,
      asRole,
    );

    if (isMonitoringAPIError(joinRequest)) {
      setIsLoading(false);
      setError(joinRequest.data[0].msg);
      await reloadUserInMonitoringData();
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

  const btnVariants = [
    {
      role: RoleInInitiative.COLLABORATOR,
      config: uiText.makeJoinRequestToInitiative.asCollaborator,
    },
    {
      role: RoleInInitiative.READER,
      config: uiText.makeJoinRequestToInitiative.asReader,
    },
  ];

  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}

      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <UserRoundPlus />
            {uiText.makeJoinRequestToInitiative.popoverTrigger}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="p-2 flex flex-col w-fit border border-primary"
        >
          {btnVariants.map(({ role, config }) => (
            <ConfirmationDialog
              key={`joinDialog_${role}`}
              texts={{
                trigger: config.trigger,
                dialog: {
                  title: config.dialog.title(initiativeInfo?.name ?? ""),
                  description: config.dialog.description,
                },
                actionBtns: config.actionBtns,
              }}
              triggerBtnVariant="ghost"
              handler={() => void handleJoinInitiative(role)}
              isLoading={isLoading}
            />
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
