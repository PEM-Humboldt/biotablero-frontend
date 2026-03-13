import { useCallback, useEffect, useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";

import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { Combobox } from "@ui/ComboBox";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { getUsers } from "pages/monitoring/api/services/user";
import { UsersListForManagement } from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/UserListForManagement";
import type { InitiativeUser } from "pages/monitoring/types/odataResponse";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { InitiativeInfoUpdater } from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/InitiativeInfoUpdater";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/layout/uiText";
import { InitiativeInvitationForm } from "pages/monitoring/outlets/initiativeJoinInvitation/InitiativeInvitationForm";
import { InitiativeTagForm } from "pages/monitoring/outlets/initiativeTag/InitiativeTagForm";

export function InitiativeUpdater() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [initiativeUsers, setInitiativeUsers] = useState<InitiativeUser[]>([]);

  const { userInitiativesAs } = useUserInMonitoringCTX();
  const initiativesAsLeader = userInitiativesAs[RoleInInitiative.LEADER];

  useEffect(() => {
    if (!initiativesAsLeader || initiativesAsLeader.length !== 1) {
      return;
    }

    setSelectedId(String(initiativesAsLeader[0].id));
  }, [initiativesAsLeader, selectedId]);

  // NOTE: Aunque en este momento la mayoría de info de usuarios se puede obtener
  // de las iniciativas como líder, creo que a futuro van a distanciarse y la
  // info más completa va a ser llamada del endpoint que se usó acá
  const getUsersDetail = useCallback(async () => {
    if (!selectedId) {
      return;
    }
    setInitiativeUsers([]);
    setIsLoading(true);

    const res = await getUsers(selectedId);
    if (isMonitoringAPIError(res)) {
      setError(res.data[0].msg);

      setIsLoading(false);
      return;
    }

    setInitiativeUsers(res);
    setIsLoading(false);
  }, [selectedId]);

  useEffect(() => {
    void getUsersDetail();
  }, [getUsersDetail]);

  const currentInitiative =
    initiativesAsLeader?.filter(
      (initiative) => initiative.id === Number(selectedId),
    )[0] || null;

  return (
    <>
      {isLoading && (
        <div className="bg-primary text-primary-foreground font-normal text-center text-2xl p-4 rounded-lg">
          {uiText.loading}
        </div>
      )}
      {error && <ErrorsList errorItems={[error]} />}

      <div className="w-full p-4 bg-background rounded-xl">
        {initiativesAsLeader && initiativesAsLeader?.length > 1 && (
          <Combobox
            items={initiativesAsLeader}
            value={selectedId}
            setValue={setSelectedId}
            keys={{ forLabel: "name", forValue: "id" }}
            uiText={{ ...uiText.initiativeSelector }}
            className="mb-2"
          />
        )}

        {currentInitiative && (
          <Tabs
            defaultValue={uiText.tabsLabels.usersManagement[0].value}
            className="common-tabs"
          >
            <TabsList className="tabs-list">
              {uiText.tabsLabels.usersManagement.map((tab) => (
                <TabsTrigger
                  key={`trigger_${tab.value}`}
                  value={tab.value}
                  className="tabs-trigger"
                >
                  {tab.label}
                </TabsTrigger>
              ))}

              <TabsTrigger value="initiative" className="tabs-trigger">
                {uiText.tabsLabels.initiativeManagement.label}
              </TabsTrigger>

              <TabsTrigger value="initiativeTag" className="tabs-trigger">
                {uiText.tabsLabels.tagManagement.label}
              </TabsTrigger>

              <TabsTrigger value="invitation" className="tabs-trigger">
                {uiText.tabsLabels.initiativeInvitation.label}
              </TabsTrigger>
            </TabsList>

            {uiText.tabsLabels.usersManagement.map((tab) => (
              <TabsContent
                value={tab.value}
                key={`content_${tab.value}`}
                className="tabs-content"
              >
                <UsersListForManagement
                  users={initiativeUsers}
                  inRole={
                    RoleInInitiative[tab.value as keyof typeof RoleInInitiative]
                  }
                  updater={getUsersDetail}
                />
              </TabsContent>
            ))}

            <TabsContent value="initiative" className="tabs-content">
              <InitiativeInfoUpdater initiativeId={currentInitiative.id} />
            </TabsContent>

            <TabsContent value="initiativeTag" className="tabs-content">
              <InitiativeTagForm initiativeId={currentInitiative.id} />
            </TabsContent>

            <TabsContent value="invitation" className="tabs-content">
              <InitiativeInvitationForm initiativeId={currentInitiative.id} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
