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
  userPosibleRoleChanges,
  UserStateInInitiative,
} from "pages/monitoring/types/userJoinRequest";
import {
  type ConfirmationDialogProps,
  ConfirmationDialog,
} from "@ui/ConfirmationDialog";
import { userStateInInitiativeDictionary } from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/layout/uiText";
import { type ButtonProps } from "@ui/shadCN/component/button";
import type { InitiativeUser } from "pages/monitoring/types/odataResponse";
import {
  INITIATIVE_LEADERS_MAX_AMOUNT,
  INITIATIVE_LEADERS_MIN_AMOUNT,
} from "@config/monitoring";

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
  return userPosibleRoleChanges[initiativeRoleToState[role]].get(action);
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
          "Promueva un participante como lider antes de reasignar este Lider",
      },
    ],
    [RoleInInitiative.USER]: [
      {
        action: RoleEvents.PROMOTE,
        condition:
          leadersAmount !== null &&
          leadersAmount >= INITIATIVE_LEADERS_MAX_AMOUNT,
        textToRender: `No pueden haber más de ${INITIATIVE_LEADERS_MAX_AMOUNT} líderes por iniciativa`,
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
          title: `Asignar rol de '${newStateStr}'`,
          sr: `Asignar rol de '${newStateStr}'`,
          icon: UserRoundCheck,
          label: "",
        },
        dialog: {
          title: `Vas a asignar a ${username} el rol de '${newStateStr}'`,
          description: "Al hacerlo ... ",
        },
        actionBtns: { confirm: undefined, cancel: undefined, exit: undefined },
      },
      triggerBtnVariant: "default",
      triggerBtnSize: "icon",
      confirmationTitle: "Usuario promovido",
      toast: {
        description: `El rol de ${username} ahora es '${newStateStr}'.`,
        icon: UserRoundCheck,
        iconClassName: "size-8 text-primary",
        className: "px-6! gap-6! border-2! border-primary!",
      },
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
          title: `Asignar rol de '${newStateStr}'`,
          sr: `Asignar rol de '${newStateStr}'`,
          icon: UserRoundPen,
          label: "",
        },
        dialog: {
          title: `Vas a asignar a ${username} el rol de '${newStateStr}'`,
          description: "Al hacerlo ... ",
        },
        actionBtns: { confirm: undefined, cancel: undefined, exit: undefined },
      },
      triggerBtnVariant: "default",
      triggerBtnSize: "icon",
      confirmationTitle: "Rol de usuario reasignado",
      toast: {
        description: `El rol de ${username} ahora es '${newStateStr}'.`,
        icon: UserRoundCheck,
        iconClassName: "size-8 text-accent",
        className: "px-6! gap-6! border-2! border-accent!",
      },
      component: ConfirmationDialog,
    };
  },

  [RoleEvents.REMOVE]: (username: string, _: RoleInInitiative) => {
    return {
      component: DestructiveConfirmationDialog,
      triggerBtnVariant: "outline_destructive",
      triggerBtnSize: "icon",
      dialog: {
        trigger: {
          title: "Retirar de la iniciativa",
          sr: "Retirar de la iniciativa",
          icon: UserRoundXIcon,
          label: "",
        },
        dialog: {
          title: `Vas a retirar a ${username} de la iniciativa`,
          description: "Al hacerlo ... ",
        },
        actionBtns: { confirm: undefined, cancel: undefined, exit: undefined },
      },

      confirmationTitle: "El usuario ya no hace parte de la iniciativa",
      toast: {
        description: `${username} ya no hace parte de esta iniciativa.`,
        icon: UserRoundCheck,
        iconClassName: "size-8 text-accent",
        className: "px-6! gap-6! border-2! border-accent!",
      },
    };
  },
};
