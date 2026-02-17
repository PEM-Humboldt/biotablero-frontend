import type {
  InitiativeUser,
  UserInitiatives,
} from "pages/monitoring/types/requestParams";
import { useCallback, useEffect, useState } from "react";

import { RoleInInitiative } from "pages/monitoring/outlets/InitiativesManagement";
import { Combobox } from "@ui/ComboBox";
import {
  getUsers,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import { commonErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";

export function InitiativeUpdater({
  initiativesAsLeader,
}: {
  initiativesAsLeader: UserInitiatives[] | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [initiativeUsers, setInitiativeUsers] = useState<InitiativeUser[]>([]);

  useEffect(() => {
    if (!initiativesAsLeader || initiativesAsLeader.length !== 1) {
      return;
    }

    setSelectedId(String(initiativesAsLeader[0].id));
  }, [initiativesAsLeader, selectedId]);

  useEffect(() => {
    // NOTE: Aunque en este momento la mayoría de info de usuarios se puede obtener
    // de las iniciativas como líder, creo que a futuro van a distanciarse y la
    // info más completa va a ser llamada del endpoint que se usó acá

    const getUsersDetail = async () => {
      if (!selectedId) {
        return;
      }

      setIsLoading(true);
      try {
        const res = await getUsers(selectedId);

        if (isMonitoringAPIError(res)) {
          const { status, message, data } = res;
          setError(
            `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
          );

          setInitiativeUsers([]);
          return;
        }

        setInitiativeUsers(res);
      } catch (err) {
        console.error(err);
        setError("Error crítico");
      } finally {
        setIsLoading(false);
      }
    };

    void getUsersDetail();
  }, [selectedId]);

  const currentInitiative =
    initiativesAsLeader?.filter(
      (initiative) => initiative.id === Number(selectedId),
    )[0] || null;

  return (
    <>
      {isLoading && <div>Cargando mi perro...</div>}
      {error && <ErrorsList errorItems={[error]} />}

      {initiativesAsLeader && initiativesAsLeader?.length > 1 && (
        <Combobox
          items={initiativesAsLeader}
          value={selectedId}
          setValue={setSelectedId}
          keys={{ forLabel: "name", forValue: "id" }}
          uiText={{
            itemNotFound: "Iniciativa no encontrada",
            trigger: "Selecciona la iniciativa",
            inputPlaceholder: "carajo",
          }}
        />
      )}

      {currentInitiative && (
        <>
          <UsersListForManagement
            title="Líderes y lideresas de la iniciativa"
            users={initiativeUsers}
            inRole={RoleInInitiative.LEADER}
          />
          <UsersListForManagement
            title="Participantes de la iniciativa"
            users={initiativeUsers}
            inRole={RoleInInitiative.USER}
          />
          <UsersListForManagement
            title="Observadores de la iniciativa"
            users={initiativeUsers}
            inRole={RoleInInitiative.VIEWER}
          />
        </>
      )}
    </>
  );
}

function UsersListForManagement({
  title,
  users,
  inRole,
}: {
  title: string;
  users: InitiativeUser[];
  inRole: RoleInInitiative;
}) {
  const usersInRole = users.filter(
    (user) => Number(user.level.id) === Number(inRole),
  );

  return (
    <div className="bg-background w-full p-4 rounded-xl">
      <h4>{title}</h4>
      {usersInRole.length === 0 ? (
        <div>No hay usuarios dentro de la iniciativa en esta categoría</div>
      ) : (
        <ul className="w-full space-y-2">
          {usersInRole.map((user) => {
            const formatedDate = new Date(user.creationDate).toLocaleString();
            return (
              <li
                key={user.id}
                className="flex gap-4 bg-muted py-2 px-4 items-center rounded-lg border border-primary/50"
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
                {/* <ActionsToUserByRole user={user} role={inRole} /> */}
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
}: {
  user: InitiativeUser;
  initiativeId: number;
  role: RoleInInitiative;
}) {
  const changeUserRole = async (user, role) => {};

  const removeUserFromInitiative = async (user, initiativeId) => {};

  switch (role) {
    case RoleInInitiative.LEADER:
      return <div>a</div>;
    case RoleInInitiative.USER:
      return <div>b</div>;
    case RoleInInitiative.VIEWER:
      return <div>c</div>;
    default:
      return null;
  }
}
