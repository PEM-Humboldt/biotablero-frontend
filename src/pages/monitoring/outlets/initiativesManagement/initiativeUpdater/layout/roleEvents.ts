import { RoleInInitiative } from "pages/monitoring/types/catalog";
import {
  DestructiveConfirmationDialog,
  type DestructiveConfirmationDialogProps,
} from "@ui/DestructiveConfirmationDialog";
import {
  UserRoundCheck,
  type LucideIcon,
  UserRoundPen,
  UserRoundXIcon,
} from "lucide-react";
import { type ComponentType } from "react";
import {
  initiativeRoleToState,
  RoleEvents,
  userPossibleRoleChanges,
  UserStateInInitiative,
} from "pages/monitoring/types/userJoinRequest";
import {
  type ConfirmationDialogProps,
  ConfirmationDialog,
} from "@ui/ConfirmationDialog";
import {
  roleDictionary,
  userStateInInitiativeDictionary,
} from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/layout/uiText";
import { type ButtonProps } from "@ui/shadCN/component/button";
import type { InitiativeUser } from "pages/monitoring/types/odataResponse";
import {
  INITIATIVE_LEADERS_MAX_AMOUNT,
  INITIATIVE_LEADERS_MIN_AMOUNT,
} from "@config/monitoring";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/layout/uiText";

type RoleEventInfo = {
  dialog: {
    trigger: {
      title?: string;
      sr?: string;
      label: string;
      icon?: LucideIcon;
    };
    dialog: { title: string; description: string };
    actionBtns?: { confirm?: string; cancel?: string; exit?: string };
  };
  triggerBtnVariant: ButtonProps["variant"];
  triggerBtnSize: ButtonProps["size"];
  confirmationTitle: string;
  toast: {
    description: string;
    icon: LucideIcon;
    className: string;
    iconClassName: string;
  };
  component: ComponentType<
    DestructiveConfirmationDialogProps | ConfirmationDialogProps
  >;
};

function getNewStateInInitiative(role: RoleInInitiative, action: RoleEvents) {
  return userPossibleRoleChanges[initiativeRoleToState[role]].get(action);
}

export function roleEventRestrictions(
  usersByRole: Partial<Record<RoleInInitiative, InitiativeUser[]>>,
): Partial<
  Record<
    RoleInInitiative,
    { action: RoleEvents; condition: boolean; textToRender: string }[]
  >
> {
  const leadersAmount = usersByRole[RoleInInitiative.LEADER]?.length ?? null;

  return {
    [RoleInInitiative.LEADER]: [
      {
        action: RoleEvents.REASING,
        condition:
          leadersAmount !== null &&
          leadersAmount <= INITIATIVE_LEADERS_MIN_AMOUNT,
        textToRender:
          uiText.tabsContent.usersManagement.roleEvents.conditional
            .minLeaderAmount,
      },
    ],
    [RoleInInitiative.USER]: [
      {
        action: RoleEvents.PROMOTE,
        condition:
          leadersAmount !== null &&
          leadersAmount >= INITIATIVE_LEADERS_MAX_AMOUNT,
        textToRender:
          uiText.tabsContent.usersManagement.roleEvents.conditional.maxLeaderAmount(
            INITIATIVE_LEADERS_MAX_AMOUNT,
          ),
      },
    ],
  };
}

export const roleEventInfo: Record<
  RoleEvents,
  (username: string, role: RoleInInitiative) => RoleEventInfo
> = {
  [RoleEvents.PROMOTE]: (username: string, role: RoleInInitiative) => {
    const newStateStr =
      userStateInInitiativeDictionary[
        getNewStateInInitiative(role, RoleEvents.PROMOTE) ??
          UserStateInInitiative.IDLE
      ];

    return {
      dialog: {
        trigger: {
          icon: UserRoundCheck,
          ...uiText.tabsContent.usersManagement.roleEvents.promote.trigger(
            newStateStr,
          ),
        },
        dialog: uiText.tabsContent.usersManagement.roleEvents.promote.dialog(
          username,
          newStateStr,
        ),
        actionBtns:
          uiText.tabsContent.usersManagement.roleEvents.promote.confirmBtns,
      },
      confirmationTitle:
        uiText.tabsContent.usersManagement.roleEvents.promote.toast.title,
      toast: {
        description:
          uiText.tabsContent.usersManagement.roleEvents.promote.toast.description(
            username,
            newStateStr,
          ),
        icon: UserRoundCheck,
        iconClassName: "size-8 text-primary",
        className: "px-6! gap-6! border-2! border-primary!",
      },
      triggerBtnVariant: "default",
      triggerBtnSize: "icon",
      component: ConfirmationDialog,
    };
  },

  [RoleEvents.REASING]: (username: string, role: RoleInInitiative) => {
    const newStateStr =
      userStateInInitiativeDictionary[
        getNewStateInInitiative(role, RoleEvents.REASING) ??
          UserStateInInitiative.IDLE
      ];

    return {
      dialog: {
        trigger: {
          icon: UserRoundPen,
          ...uiText.tabsContent.usersManagement.roleEvents.reasign.trigger(
            newStateStr,
          ),
        },
        dialog: uiText.tabsContent.usersManagement.roleEvents.reasign.dialog(
          username,
          newStateStr,
        ),
        actionBtns:
          uiText.tabsContent.usersManagement.roleEvents.reasign.confirmBtns,
      },
      confirmationTitle:
        uiText.tabsContent.usersManagement.roleEvents.reasign.toast.title,
      toast: {
        description:
          uiText.tabsContent.usersManagement.roleEvents.reasign.toast.description(
            username,
            newStateStr,
          ),
        icon: UserRoundCheck,
        iconClassName: "size-8 text-accent",
        className: "px-6! gap-6! border-2! border-accent!",
      },
      triggerBtnVariant: "default",
      triggerBtnSize: "icon",
      component: ConfirmationDialog,
    };
  },

  [RoleEvents.REMOVE]: (username: string, role: RoleInInitiative) => {
    const userCurrentRole = roleDictionary[role];

    return {
      dialog: {
        trigger: {
          icon: UserRoundXIcon,
          ...uiText.tabsContent.usersManagement.roleEvents.remove.trigger,
        },
        dialog: uiText.tabsContent.usersManagement.roleEvents.remove.dialog(
          username,
          userCurrentRole,
        ),
        actionBtns:
          uiText.tabsContent.usersManagement.roleEvents.remove.confirmBtns,
      },

      confirmationTitle:
        uiText.tabsContent.usersManagement.roleEvents.remove.toast.title,
      toast: {
        description:
          uiText.tabsContent.usersManagement.roleEvents.remove.toast.description(
            username,
          ),
        icon: UserRoundCheck,
        iconClassName: "size-8 text-accent",
        className: "px-6! gap-6! border-2! border-accent!",
      },
      triggerBtnVariant: "outline_destructive",
      triggerBtnSize: "icon",
      component: DestructiveConfirmationDialog,
    };
  },
};
