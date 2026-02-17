import type {
  InitiativeUser,
  UserInitiatives,
} from "pages/monitoring/types/requestParams";
import { useEffect, useState } from "react";

import { RoleInInitiative } from "pages/monitoring/outlets/InitiativesManagement";
import { Combobox } from "@ui/ComboBox";
import {
  getUsers,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import { commonErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";

const usersManagementTabs: {
  label: string;
  value: keyof typeof RoleInInitiative;
}[] = [
  { label: "Gestión de líderes", value: "LEADER" },
  { label: "gestión de participanter", value: "USER" },
  { label: "gestión de observadores", value: "VIEWER" },
];

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

      <div className="w-full p-4 bg-background rounded-xl">
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
            className="mb-2 w-[25%]!"
          />
        )}

        {currentInitiative && (
          <Tabs
            defaultValue={usersManagementTabs[0].value}
            className="common-tabs"
          >
            <TabsList className="tabs-list">
              {usersManagementTabs.map((tab) => (
                <TabsTrigger
                  key={`trigger_${tab.value}`}
                  value={tab.value}
                  className="tabs-trigger"
                >
                  {tab.label}
                </TabsTrigger>
              ))}

              <TabsTrigger value="initiative" className="tabs-trigger">
                Gestión de la iniciativa
              </TabsTrigger>
            </TabsList>

            {usersManagementTabs.map((tab) => (
              <TabsContent
                value={tab.value}
                key={`content_${tab.value}`}
                className="tabs-content"
              >
                <UsersListForManagement
                  users={initiativeUsers}
                  inRole={RoleInInitiative[tab.value]}
                />
              </TabsContent>
            ))}

            <TabsContent value="initiative" className="tabs-content">
              carajo
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}

function UsersListForManagement({
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
