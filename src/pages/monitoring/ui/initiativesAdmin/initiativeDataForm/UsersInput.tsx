import { useEffect, useMemo, useState } from "react";

import { Combobox } from "@ui/ComboBox";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { INITIATIVE_DISPLAY_LEADERS_SEARCH } from "@config/monitoring";

import type { ItemEditorProps } from "pages/monitoring/types/initiativeData";
import type { UserItem } from "pages/monitoring/types/catalog";
import { getUsers } from "pages/monitoring/api/services/user";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  NEW_ADMIN_CREDENTIALS,
  normalizeUsersFromOData,
} from "pages/monitoring/utils/manageUsers";
import { InputListActionButtons } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/InputListActionButtons";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";

export function UsersInput<T extends UserItem>({
  selectedItems,
  setter,
  update,
  discard,
  disabled = false,
}: ItemEditorProps<T>) {
  const [allUsers, setAllUsers] = useState<Partial<UserItem>[]>([]);
  const [user, setUser] = useState<string>("");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const getUsersInfo = async () => {
      const users = await getUsers();

      if (isMonitoringAPIError(users)) {
        setAllUsers([]);
        return;
      }

      const usersInfo = normalizeUsersFromOData(users);
      setAllUsers(usersInfo);
    };

    void getUsersInfo();
  }, []);

  useEffect(() => {
    setUser(update !== null ? update.userName : "");
  }, [update]);

  const usersAvailable = useMemo((): Partial<UserItem>[] => {
    if (selectedItems === undefined || !Array.isArray(selectedItems)) {
      return allUsers;
    }
    const selectedUsers = new Set(
      selectedItems.map((u: UserItem) => u.userName),
    );
    return allUsers.filter(
      (u: Partial<UserItem>) => !selectedUsers.has(u.userName!),
    );
  }, [selectedItems, allUsers]);

  const handleSave = () => {
    if (!user) {
      return;
    }
    const newUser = {
      userName: user,
      level: NEW_ADMIN_CREDENTIALS,
    } as UserItem;

    setter(newUser as T);
    setUser("");
    setInputErr({});
  };

  const handleDiscard = () => {
    if (update && discard) {
      discard();
    }
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
          <span className="sr-only">
            {uiText.initiative.module.users.field.username.label}
          </span>
        </LabelAndErrors>
        <Combobox
          id="leaders"
          items={usersAvailable}
          maxItems={INITIATIVE_DISPLAY_LEADERS_SEARCH}
          value={user}
          setValue={setUser}
          keys={{ forLabel: "userName" }}
          uiText={{
            itemNotFound:
              uiText.initiative.module.users.field.username.notFound,
            trigger: uiText.initiative.module.users.field.username.trigger,
            inputPlaceholder:
              uiText.initiative.module.users.field.username.placeholder,
          }}
          aria-invalid={inputErr.leaders !== undefined}
          aria-describedby={inputErr.leaders ? "errors_leaders" : undefined}
        />
      </div>

      <InputListActionButtons
        update={update}
        handleSave={handleSave}
        handleDiscard={handleDiscard}
        disabled={disabled}
      />
    </div>
  );
}
