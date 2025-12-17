import { useCallback, useEffect, useState } from "react";

import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { User } from "pages/monitoring/types/monitoring";
import { USER_LEVELS } from "pages/monitoring/utils/manageUsers";
import {
  getUsers,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import { Combobox } from "@ui/ComboBox";
import { Button } from "@ui/shadCN/component/button";
import { CirclePlus, Eraser } from "lucide-react";
import { Label } from "@ui/shadCN/component/label";
import { TextAndErrorForLabel } from "@ui/TextAndErrorForLabel";

const DEFAULT_NEW_ADMIN_CREDENTIALS = USER_LEVELS[0];

export function UsersInfoInput({ setter, update }: ItemEditorProps<User>) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<number | string>("");
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    const getUsersInfo = async () => {
      try {
        const usersInfo = await getUsers();
        if (isMonitoringAPIError(usersInfo)) {
          throw new Error(usersInfo.message);
        }
        setUsers(usersInfo);
      } catch (err) {
        console.error(err);
      }
    };

    void getUsersInfo();
  }, []);

  const reset = useCallback(() => {
    setUser(update !== null ? update.userName : "");
  }, [update]);

  useEffect(() => {
    if (!update) {
      return;
    }

    reset();
  }, [update, reset]);

  const handleSave = () => {
    const newUser = {
      userName: user,
      level: DEFAULT_NEW_ADMIN_CREDENTIALS,
    } as User;

    setter((savedData) => {
      if (savedData.some((u) => u.userName === user)) {
        setError((errStack) => [
          ...errStack,
          `${user} ya es administrador de la iniciativa`,
        ]);
        return savedData;
      }

      setError([]);
      setUsers((oldUsers) => [...oldUsers.filter((u) => u.userName !== user)]);
      return [...savedData, newUser];
    });
    reset();
  };

  return (
    <div className="flex gap-2 [&>label]:flex-1 items-end mb-4">
      <Label className="flex-1" htmlFor="leaders2">
        <TextAndErrorForLabel validationErrors={error}>
          <span className="sr-only">Selecciona un lider o lidereza</span>
        </TextAndErrorForLabel>
        <Combobox
          id="leaders2"
          items={users}
          value={user}
          setValue={setUser}
          keys={{ forLabel: "userName" }}
          uiText={{
            itemNotFound: "Usuario no encontrado",
            trigger: "Selecciona un usuario ",
            inputPlaceholder: "buscar lider",
          }}
        />
      </Label>

      <Button onClick={handleSave} type="button" variant="outline" size="icon">
        <span className="sr-only">Incorporar como lider a la iniciativa</span>
        <span aria-hidden="true">
          <CirclePlus className="size-5" />
        </span>
      </Button>
    </div>
  );
}

export function UsersInfoDisplay({
  items,
  editItem: _,
  deleteItem,
}: ItemsRenderProps<User>) {
  return (
    items.length > 0 && (
      <ul>
        {items.map((user, i) => (
          <li>
            {user.userName}

            <Button
              type="button"
              onClick={() => deleteItem(i)}
              variant="ghost-clean"
              size="icon-sm"
            >
              <span className="sr-only">borrar la siguiente información</span>
              <span aria-hidden="true">
                <Eraser className="size-4" />
              </span>
            </Button>
          </li>
        ))}
      </ul>
    )
  );
}
