import { useEffect, useMemo, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { CirclePlus, Trash } from "lucide-react";
import { Combobox } from "@ui/ComboBox";
import { LabelAndErrors } from "@ui/LabelingWithErrors";

import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { User } from "pages/monitoring/types/monitoring";
import {
  getUsers,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import { NEW_ADMIN_CREDENTIALS } from "pages/monitoring/utils/manageUsers";

const INITIATIVE_DISPLAY_LEADERS_SEARCH = 5;

export function UsersInfoInput({
  selectedItems,
  setter,
  update,
}: ItemEditorProps<User>) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [user, setUser] = useState<string>("");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const getUsersInfo = async () => {
      try {
        const usersInfo = await getUsers();
        if (isMonitoringAPIError(usersInfo)) {
          throw new Error(usersInfo.message);
        }
        setAllUsers(usersInfo);
      } catch (err) {
        console.error(err);
      }
    };

    void getUsersInfo();
  }, []);

  useEffect(() => {
    if (!update) {
      return;
    }

    setUser(update !== null ? update.userName : "");
  }, [update]);

  const usersAvailable = useMemo((): User[] => {
    if (selectedItems === undefined || !Array.isArray(selectedItems)) {
      return allUsers;
    }
    const selectedUsers = new Set(selectedItems.map((u: User) => u.userName));
    return allUsers.filter((u: User) => !selectedUsers.has(u.userName));
  }, [selectedItems, allUsers]);

  const handleSave = () => {
    if (!user) {
      return;
    }
    const newUser = {
      userName: user,
      level: NEW_ADMIN_CREDENTIALS,
    } as User;

    setUser("");
    setInputErr({});
    setter((savedData) => [...savedData, newUser]);
  };

  return (
    <div className="flex gap-2 [&>label]:flex-1 items-end mb-4">
      <div className="flex-1">
        <LabelAndErrors
          errID="errors_leaders"
          htmlFor="leaders"
          validationErrors={inputErr?.leaders ?? []}
        >
          <span className="sr-only">Selecciona un lider o lidereza</span>
        </LabelAndErrors>
        <Combobox
          id="leaders"
          items={usersAvailable}
          maxItems={INITIATIVE_DISPLAY_LEADERS_SEARCH}
          value={user}
          setValue={setUser}
          keys={{ forLabel: "userName" }}
          uiText={{
            itemNotFound: "Usuario no encontrado",
            trigger: "Selecciona un usuario ",
            inputPlaceholder: "buscar lider",
          }}
          aria-invalid={inputErr.leaders !== undefined}
          aria-describedby={inputErr.location ? "errors_leaders" : undefined}
        />
      </div>

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
  selectedItems: items,
  editItem: _,
  deleteItem,
}: ItemsRenderProps<User>) {
  return (
    items.length > 0 && (
      <>
        <h3 id="initiativeLeadersList" className="border-b h4">
          Líderes inscritos actualmente
        </h3>

        <ul aria-labelledby="initiativeLeadersList">
          {items.map((user, i) => (
            <li
              key={`${user.userName}_${i}`}
              className="flex items-center justify-between hover:bg-muted"
            >
              {user.userName}

              <Button
                type="button"
                onClick={() => deleteItem(i)}
                variant="ghost-clean"
                size="icon-sm"
              >
                <span className="sr-only">Quitar como administrador</span>
                <span aria-hidden="true">
                  <Trash className="size-4" />
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </>
    )
  );
}
