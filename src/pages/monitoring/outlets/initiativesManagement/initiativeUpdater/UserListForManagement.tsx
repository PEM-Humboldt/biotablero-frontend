import type { InitiativeUser } from "pages/monitoring/types/requestParams";

import { Button } from "@ui/shadCN/component/button";

import { RoleInInitiative } from "pages/monitoring/outlets/InitiativesManagement";
import { ConfirmationDialog } from "pages/monitoring/ui/ConfirmationDialog";
import { DestructiveConfirmationDialog } from "pages/monitoring/ui/DestructiveConfirmationDialog";
import { RotateCcw, Ban, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { changeUserRoleInInitiative } from "pages/monitoring/api/monitoringAPI";
import { toast } from "sonner";

export function UsersListForManagement({
  users,
  inRole,
}: {
  users: InitiativeUser[];
  inRole: RoleInInitiative;
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
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const roleDictionary = {
  1: "Líder",
  2: "Miembro",
  3: "Observador",
};

function ActionsToUserByRole({
  user,
  role,
  currentUsers,
}: {
  user: InitiativeUser;
  role: RoleInInitiative;
  currentUsers: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const changeUserRole = async (role: RoleInInitiative) => {
    setIsLoading(true);
    const res = await changeUserRoleInInitiative(user.id, role);
    setIsLoading(false);

    if (res) {
      toast("Error", {
        position: "bottom-right",
        description: res,
        icon: <Ban className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });
    }

    toast("Rol reasignado", {
      position: "bottom-right",
      description: `El rol de ${user.userName} ahora es ${roleDictionary[role]}.`,
      icon: <UserRoundCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
    });
  };

  const removeUserFromInitiative = async () => {};

  switch (role) {
    case RoleInInitiative.LEADER:
      return (
        currentUsers > 1 && (
          <DestructiveConfirmationDialog
            triggerBtnVariant="destructive"
            texts={{
              trigger: { label: "reasignar", icon: RotateCcw },
              dialog: {
                title: "Reasignación como miembro",
                description:
                  "Al reasignar a ..., este no podra realizar las acciones de adminmistrador",
              },
            }}
            handler={() => void changeUserRole(RoleInInitiative.USER)}
            isLoading={isLoading}
          />
        )
      );
    case RoleInInitiative.USER:
      return (
        <div>
          <Button>Promover</Button>
        </div>
      );
    case RoleInInitiative.VIEWER:
      return <div>c</div>;
    default:
      return null;
  }
}
