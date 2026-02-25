import type { RoleInInitiative } from "pages/monitoring/types/catalog";
import {
  DestructiveConfirmationDialog,
  type DestructiveConfirmationDialogProps,
} from "pages/monitoring/ui/DestructiveConfirmationDialog";
import {
  Ban,
  UserRoundCheck,
  type LucideIcon,
  UserRoundPen,
  UserRoundXIcon,
} from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import {
  changeUserRoleInInitiative,
  removeUserFromInitiative,
} from "pages/monitoring/api/monitoringAPI";
import { toast } from "sonner";
import type { InitiativeUser } from "pages/monitoring/types/odataResponse";
import {
  initiativeRoleToState,
  RoleEvents,
  stateToInitiativeRole,
  userPosibleRoleChanges,
} from "pages/monitoring/types/userJoinRequest";
import { type ConfirmationDialogProps } from "pages/monitoring/ui/ConfirmationDialog";
import { ConfirmationDialog } from "@ui/ConfirmationDialog";
import { roleDictionary } from "./layout/uiText";
import { type ButtonProps } from "@ui/shadCN/component/button";

function getNewStateInInitiative(role: RoleInInitiative, action: RoleEvents) {
  return userPosibleRoleChanges[initiativeRoleToState[role]].get(action);
}

const roleChangeDictionary: Record<
  RoleEvents,
  {
    dialog: (
      username: string,
      role: RoleInInitiative,
    ) => {
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
    toast: (
      name: string,
      role: RoleInInitiative,
    ) => {
      description: string;
      icon: ReactNode;
      className: string;
    };
    component: ComponentType<
      DestructiveConfirmationDialogProps | ConfirmationDialogProps
    >;
  }
> = {
  [RoleEvents.PROMOTE]: {
    dialog: (username: string, role: RoleInInitiative) => ({
      trigger: {
        title: `Convertir en ${getNewStateInInitiative(role, RoleEvents.PROMOTE)}`,
        sr: `Convertir en ${getNewStateInInitiative(role, RoleEvents.PROMOTE)}`,
        icon: UserRoundCheck,
        label: "",
      },
      dialog: {
        title: `Vas a convertir a ${username} en un usuario ${getNewStateInInitiative(role, RoleEvents.PROMOTE)}`,
        description: "Al hacerlo ... ",
      },
      actionBtns: { confirm: undefined, cancel: undefined, exit: undefined },
    }),
    triggerBtnVariant: "default",
    triggerBtnSize: "icon",
    confirmationTitle: "Usuario promovido",
    toast: (name: string, role: RoleInInitiative) => ({
      description: `El rol de ${name} ahora es ${getNewStateInInitiative(role, RoleEvents.PROMOTE)}}.`,
      icon: <UserRoundCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
    }),
    component: ConfirmationDialog,
  },

  [RoleEvents.REASING]: {
    dialog: (username: string, role: RoleInInitiative) => ({
      trigger: {
        title: `Convertir en ${getNewStateInInitiative(role, RoleEvents.REASING)}`,
        sr: `Convertir en ${getNewStateInInitiative(role, RoleEvents.REASING)}`,
        icon: UserRoundPen,
        label: "",
      },
      dialog: {
        title: `Vas a convertir a ${username} en un usuario ${getNewStateInInitiative(role, RoleEvents.REASING)}`,
        description: "Al hacerlo ... ",
      },
      actionBtns: { confirm: undefined, cancel: undefined, exit: undefined },
    }),
    triggerBtnVariant: "default",
    triggerBtnSize: "icon",
    confirmationTitle: "Rol de usuario reasignado",
    toast: (name: string, role: RoleInInitiative) => ({
      description: `El rol de ${name} ahora es ${roleDictionary[role]}.`,
      icon: <UserRoundCheck className="size-8 text-accent" />,
      className: "px-6! gap-6! border-2! border-accent!",
    }),
    component: ConfirmationDialog,
  },

  [RoleEvents.REMOVE]: {
    component: DestructiveConfirmationDialog,
    triggerBtnVariant: "outline_destructive",
    triggerBtnSize: "icon",
    dialog: (username: string, _: RoleInInitiative) => ({
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
    }),

    confirmationTitle: "El usuario ya no hace parte de la iniciativa",
    toast: (name: string, role: RoleInInitiative) => ({
      description: `El rol de ${name} ahora es ${roleDictionary[role]}.`,
      icon: <UserRoundCheck className="size-8 text-accent" />,
      className: "px-6! gap-6! border-2! border-accent!",
    }),
  },
};

export function UsersListForManagement({
  users,
  inRole,
  updater,
}: {
  users: InitiativeUser[];
  inRole: RoleInInitiative;
  updater: () => Promise<void>;
}) {
  const usersInRole = users.filter(
    (user) => Number(user.level.id) === Number(inRole),
  );

  return (
    <div>
      {usersInRole.length === 0 ? (
        <div className="text-2xl text-foreground text-center p-8">
          Actualmente no hay usuarios dentro de la iniciativa en esta categoría
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
                <time dateTime={formatedDate}>{formatedDate}</time>
                <ActionsToUserByRole
                  user={user}
                  role={inRole}
                  currentUsers={usersInRole.length}
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
  updater,
}: {
  user: InitiativeUser;
  role: RoleInInitiative;
  updater: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const usersState = initiativeRoleToState[role];
  const posibleActions = Array.from(userPosibleRoleChanges[usersState].keys());

  const changeUserRole = async (action: RoleEvents) => {
    const actionInfo = roleChangeDictionary[action];
    const userNextState = userPosibleRoleChanges[usersState].get(action);
    const newRoleId = userNextState
      ? stateToInitiativeRole[userNextState]
      : null;

    if (!newRoleId) {
      console.error("This role action is not allowed");
      return;
    }

    setIsLoading(true);

    const res =
      action === RoleEvents.REMOVE
        ? await removeUserFromInitiative(user.id)
        : await changeUserRoleInInitiative(user.id, newRoleId);

    await updater();

    setIsLoading(false);

    if (res) {
      toast("Error", {
        position: "bottom-right",
        description: res,
        icon: <Ban className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });

      return;
    }

    toast(actionInfo.confirmationTitle, {
      position: "bottom-right",
      ...actionInfo.toast(user.userName, role),
    });
  };

  return posibleActions.map((action) => {
    const {
      component: Comp,
      dialog,
      triggerBtnVariant,
      triggerBtnSize,
    } = roleChangeDictionary[action];
    return (
      <Comp
        key={Math.random()}
        texts={{ ...dialog(user.userName, role) }}
        triggerBtnVariant={triggerBtnVariant}
        triggerBtnSize={triggerBtnSize}
        handler={() => void changeUserRole(action)}
        isLoading={isLoading}
      />
    );
  });
}
