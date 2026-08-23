import { useState } from "react";

import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { INITIATIVE_DISPLAY_LEADERS_SEARCH } from "@config/monitoring";

import type { ItemEditorProps } from "pages/monitoring/types/initiativeData";
import type { UserItem } from "pages/monitoring/types/catalog";
import { userLevels } from "pages/monitoring/utils/manageUsers";
import { InputListActionButtons } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/InputListActionButtons";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { StableComboboxOData } from "@ui/ComboboxOData";
import type { ODataUser } from "pages/monitoring/types/odataResponse";

export function UsersInput<T extends UserItem>({
  selectedItems,
  setter,
  update,
  discard,
  disabled = false,
}: ItemEditorProps<T>) {
  const [user, setUser] = useState<string>("");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  const handleSave = () => {
    if (!user) {
      return;
    }

    const newUser = {
      userName: user,
      level: { id: 1, name: "Leader" },
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

  const usersFilter = selectedItems
    ? `not (username in (${selectedItems.map((u) => `'${u.userName}'`).join(", ")}))`
    : undefined;

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
        <StableComboboxOData<ODataUser>
          id="leaders"
          value={user}
          setValue={setUser}
          endpoint="User"
          sources={["username", "fullName"]}
          sourceProcess={(items) =>
            items.map((i) => ({
              value: i.username,
              label: `${i.fullName} (${i.username})`,
            }))
          }
          fixedFilter={usersFilter}
          maxItems={INITIATIVE_DISPLAY_LEADERS_SEARCH}
          shownItems={6}
          uiText={{
            itemNotFound: "No se encontraron iniciativas",
            trigger: "Filtrar por iniciativa",
            inputPlaceholder: "Buscar la iniciativa",
          }}
          className="[&_svg]:text-accent"
          aria-invalid={inputErr.leaders !== undefined}
          aria-describedby={inputErr.leaders ? "errors_leaders" : undefined}
        />
      </div>

      <InputListActionButtons
        update={update}
        handleSave={() => void handleSave()}
        handleDiscard={handleDiscard}
        disabled={disabled}
      />
    </div>
  );
}
