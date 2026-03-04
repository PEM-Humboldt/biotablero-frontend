import { Button } from "@ui/shadCN/component/button";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { LOGIN_URL } from "@config/monitoring";
import { uiText } from "pages/monitoring/ui/joinInitiativeRequestButton/layout/uiText";
import { LeaveInitiativeBtnAlert } from "pages/monitoring/ui/joinInitiativeRequestButton/LeaveInitiativeBtnAlert";
import { CancelJoinInitiativeRequestBtnAlert } from "pages/monitoring/ui/joinInitiativeRequestButton/CancelJoinInitiativeRequestBtnAlert";
import { MakeJoinInitiativeRequestBtnDialog } from "pages/monitoring/ui/joinInitiativeRequestButton/MakeJoinInitiativeRequestBtnDialog";

export function JoinInitiativeRequestButton() {
  const { userStateInInitiative } = useInitiativeCTX();

  switch (userStateInInitiative) {
    case UserStateInInitiative.IDLE:
      return (
        <div className="bg-muted text-muted-foreground text-center font-normal rounded-lg p-2">
          {uiText.loading}
        </div>
      );

    case UserStateInInitiative.GUEST:
      return (
        <Button asChild>
          <div className="contents">
            {uiText.noUser.icon && <uiText.noUser.icon />}
            <a href={LOGIN_URL} target="_self" rel="noopener noreferrer">
              Unirse a la iniciativa
            </a>
          </div>
        </Button>
      );

    case UserStateInInitiative.USER_NONE:
      return <MakeJoinInitiativeRequestBtnDialog />;

    case UserStateInInitiative.USER_ASPIRING:
      return <CancelJoinInitiativeRequestBtnAlert />;

    // TODO: actualizar el endpoint de `leaveInitiative` dentro de
    // `src/pages/monitoring/api/monitoringAPI.ts` cuando esté disponible,
    // de lo contrario va a arrojar error
    case UserStateInInitiative.USER_PARTICIPANT:
    case UserStateInInitiative.USER_VIEWER:
      return <LeaveInitiativeBtnAlert />;

    case UserStateInInitiative.NO_INITIATIVE:
    case UserStateInInitiative.USER_LEADER:
    case UserStateInInitiative.ADMIN:
    default:
      return null;
  }
}
