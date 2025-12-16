import { useCallback, useEffect, useState } from "react";

import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { User } from "pages/monitoring/types/monitoring";
import { USER_LEVELS } from "pages/monitoring/utils/manageUsers";

export function UsersInfoInput({ setter, update }: ItemEditorProps<User>) {
  const [userLevel, setUserLevel] = useState(0);
  const [user, setUser] = useState<{
    id: number | null;
    userName: string;
  }>({
    id: null,
    userName: "",
  });

  const reset = useCallback(() => {
    setUser(
      update !== null && update.id !== undefined
        ? { id: update.id, userName: update.userName }
        : { id: null, userName: "" },
    );
    setUserLevel(update?.level.id ?? 0);
  }, [update]);

  useEffect(() => {
    if (!update) {
      return;
    }

    reset();
  }, [update, reset]);

  const handleSave = () => {
    const levelName = USER_LEVELS.find((e) => e.id === user.id);
    if (!levelName) {
      throw new Error("User level not found");
    }

    const newUser = {
      userName: user.userName,
      ...(user.id !== null && { id: user.id }),
      level: { id: userLevel, name: levelName.name },
    };

    setter((savedData) => [...savedData, newUser]);
    reset();
  };

  return (
    <div>
      <h3>Input de usuarios</h3>
    </div>
  );
}

export function UsersInfoDisplay({
  item,
  editItem,
  deleteItem,
}: ItemsRenderProps<User>) {
  return (
    <div>
      <h3>Lista de usuarios</h3>
    </div>
  );
}
