import { useState } from "react";
import { Ban, CircleOff } from "lucide-react";
import { toast } from "sonner";

import { useUserCTX } from "@hooks/UserContext";

import { RoleInInitiative } from "pages/monitoring/types/catalog";
import type { InitiativeUser } from "pages/monitoring/types/odataResponse";
import {
  changeUserRoleInInitiative,
  removeUserFromInitiative,
} from "pages/monitoring/api/services/user";
import {
  RoleEvents,
  initiativeRoleToState,
  stateToInitiativeRole,
  userPossibleRoleChanges,
} from "pages/monitoring/types/userJoinRequest";
import {
  roleEventInfo,
  roleEventRestrictions,
} from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/layout/roleEvents";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/layout/uiText";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export function UsersListForManagement({
  users,
  inRole,
  updater,
}: {
  users: InitiativeUser[];
  inRole: RoleInInitiative;
  updater: () => Promise<void>;
}) {
  const usersByRole = users.reduce<
    Partial<Record<RoleInInitiative, InitiativeUser[]>>
  >((all, user) => {
    const roleId = user.level.id;
    if (all[roleId] === undefined) {
      all[roleId] = [] as InitiativeUser[];
    }
    all[roleId].push(user);

    return all;
  }, {});

  const usersInRole = usersByRole[inRole] ?? 0;

  return (
    <div>
      {usersInRole === 0 ? (
        <div className="text-2xl text-foreground text-center p-8">
          {uiText.tabsContent.usersManagement.noUsers}
        </div>
      ) : (
        <ul className="w-full p-2 space-y-2">
          {usersInRole.map((user) => {
            const formatedDate = new Date(user.creationDate).toLocaleString();
            return (
              <li
                key={user.id}
                className="flex gap-4 hover:bg-background py-2 px-4 items-center rounded-lg hover:outline hover:shadow-lg hover:outline-primary/50"
              >
                <div className="flex-1 flex gap-4 items-center">
                  <img
                    src={`https://picsum.photos/seed/${Math.round(Math.random() * 100)}/50/50`}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <span>{user.userName}</span>
                </div>
                <time
                  title={uiText.tabsContent.usersManagement.joiningDate.title}
                  dateTime={formatedDate}
                >
                  <span className="sr-only">
                    {uiText.tabsContent.usersManagement.joiningDate.sr}
                  </span>
                  {uiText.tabsContent.usersManagement.joiningDate.label}
                  {formatedDate}
                </time>
                <ActionsToUserByRole
                  user={user}
                  role={inRole}
                  usersByRole={usersByRole}
                  updater={updater}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ActionsToUserByRole({
  user,
  role,
  usersByRole,
  updater,
}: {
  user: InitiativeUser;
  role: RoleInInitiative;
  usersByRole: Partial<Record<RoleInInitiative, InitiativeUser[]>>;
  updater: () => Promise<void>;
}) {
  const { user: admin } = useUserCTX();
  const [isLoading, setIsLoading] = useState(false);

  const usersState = initiativeRoleToState[role];
  const posibleActions = Array.from(userPossibleRoleChanges[usersState].keys());

  const changeUserRole = async (action: RoleEvents) => {
    const actionInfo = roleEventInfo[action](user.userName, role);
    const userNextState = userPossibleRoleChanges[usersState].get(action);
    const newRoleId = userNextState
      ? stateToInitiativeRole[userNextState]
      : null;

    if (newRoleId === null || newRoleId === undefined) {
      console.error(uiText.tabsContent.usersManagement.actions.notAllowedError);
      return;
    }

    setIsLoading(true);

    const res =
      action === RoleEvents.REMOVE
        ? await removeUserFromInitiative(user.id)
        : await changeUserRoleInInitiative(user.id, newRoleId);

    await updater();
    setIsLoading(false);

    if (isMonitoringAPIError(res)) {
      toast("Error", {
        position: "bottom-right",
        description: res.data[0].msg,
        icon: <Ban className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });

      return;
    }

    toast(actionInfo.confirmationTitle, {
      position: "bottom-right",
      description: actionInfo.toast.description,
      icon: (
        <actionInfo.toast.icon className={actionInfo.toast.iconClassName} />
      ),
      className: actionInfo.toast.className,
    });

    if (
      action === RoleEvents.REASING &&
      user.level.id === RoleInInitiative.LEADER &&
      user.userName === admin?.username
    ) {
      window.location.reload();
    }
  };

  const buttonConditional = roleEventRestrictions(usersByRole);

  return (
    <div className="space-x-2">
      {posibleActions.map((action) => {
        const {
          component: Comp,
          dialog,
          triggerBtnVariant,
          triggerBtnSize,
        } = roleEventInfo[action](user.userName, role);

        const isDisabled = buttonConditional[role]?.find(
          (cond) => cond.action === action,
        );

        const dialogTexts = isDisabled?.condition
          ? {
              ...dialog,
              trigger: {
                ...dialog.trigger,
                title: isDisabled.textToRender,
                sr: isDisabled.textToRender,
                icon: CircleOff,
              },
            }
          : dialog;

        return (
          <Comp
            key={Math.random()}
            texts={{ ...dialogTexts }}
            triggerBtnVariant={triggerBtnVariant}
            triggerBtnSize={triggerBtnSize}
            handler={() => void changeUserRole(action)}
            isLoading={isLoading}
            isDisabled={isDisabled?.condition}
          />
        );
      })}
    </div>
  );
}
