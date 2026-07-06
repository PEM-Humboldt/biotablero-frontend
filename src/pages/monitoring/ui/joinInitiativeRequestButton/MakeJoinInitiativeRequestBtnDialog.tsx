import { useState } from "react";
import { toast } from "sonner";
import { UserRoundPlus } from "lucide-react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { ConfirmationDialog } from "@ui/ConfirmationDialog";
import { Button } from "@ui/shadCN/component/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/shadCN/component/dropdown-menu";

import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { makeJoinRequestToInitiative } from "pages/monitoring/api/services/initiatives";
import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";

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

  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}

      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <UserRoundPlus /> Unete a la iniciativa
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="p-2 flex flex-col w-fit">
          <ConfirmationDialog
            texts={{
              trigger:
                uiText.makeJoinRequestToInitiative.asCollaborator.trigger,
              dialog: {
                title:
                  uiText.makeJoinRequestToInitiative.asCollaborator.dialog.title(
                    initiativeInfo?.name ?? "",
                  ),
                description:
                  uiText.makeJoinRequestToInitiative.asCollaborator.dialog
                    .description,
              },
              actionBtns:
                uiText.makeJoinRequestToInitiative.asCollaborator.actionBtns,
            }}
            triggerBtnVariant="ghost"
            handler={() =>
              void handleJoinInitiative(RoleInInitiative.COLLABORATOR)
            }
            isLoading={isLoading}
          />

          <ConfirmationDialog
            texts={{
              trigger: uiText.makeJoinRequestToInitiative.asReader.trigger,
              dialog: {
                title: uiText.makeJoinRequestToInitiative.asReader.dialog.title(
                  initiativeInfo?.name ?? "",
                ),
                description:
                  uiText.makeJoinRequestToInitiative.asReader.dialog
                    .description,
              },
              actionBtns:
                uiText.makeJoinRequestToInitiative.asReader.actionBtns,
            }}
            triggerBtnVariant="ghost"
            handler={() => void handleJoinInitiative(RoleInInitiative.READER)}
            isLoading={isLoading}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
