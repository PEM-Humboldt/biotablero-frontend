import { useEffect, useMemo, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { CirclePlus } from "lucide-react";
import { Combobox } from "@ui/ComboBox";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { INITIATIVE_DISPLAY_LEADERS_SEARCH } from "@config/monitoring";

import type { ItemEditorProps } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { User } from "pages/monitoring/types/monitoring";
import {
  getUsers,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import {
  NEW_ADMIN_CREDENTIALS,
  normalizeUsersFromKC,
} from "pages/monitoring/utils/manageUsers";

export function UsersInput<T extends User>({
  selectedItems,
  setter,
  update,
}: ItemEditorProps<T>) {
  const [allUsers, setAllUsers] = useState<Partial<User>[]>([]);
  const [user, setUser] = useState<string>("");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const getUsersInfo = async () => {
      try {
        const usersKC = await getUsers();
        if (isMonitoringAPIError(usersKC)) {
          throw new Error(usersKC.message);
        }

        const usersInfo = normalizeUsersFromKC(usersKC);
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

  const usersAvailable = useMemo((): Partial<User>[] => {
    if (selectedItems === undefined || !Array.isArray(selectedItems)) {
      return allUsers;
    }
    const selectedUsers = new Set(selectedItems.map((u: User) => u.userName));
    return allUsers.filter(
      (u: Partial<User>) => !selectedUsers.has(u.userName!),
    );
  }, [selectedItems, allUsers]);

  const handleSave = () => {
    if (!user) {
      return;
    }
    const newUser = {
      userName: user,
      level: NEW_ADMIN_CREDENTIALS,
    } as User;

    setter(newUser as T);
    setUser("");
    setInputErr({});
  };

  return (
    <div className="form-input-list">
      <div>
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

      <div>
        <Button
          onClick={handleSave}
          type="button"
          variant="outline"
          size="icon"
        >
          <span className="sr-only">Incorporar como lider a la iniciativa</span>
          <span aria-hidden="true">
            <CirclePlus className="size-5" />
          </span>
        </Button>
      </div>
    </div>
  );
}
