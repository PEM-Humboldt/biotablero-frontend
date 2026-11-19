import { useMemo } from "react";

import { PageTitleUpdater } from "@ui/PageTitleUpdater";

import { InitiativeUpdater } from "pages/monitoring/outlets/myProfile/InitiativeUpdater";
import { UserProfileCard } from "pages/monitoring/outlets/myProfile/UserProfileCard";
import { UserStats } from "pages/monitoring/outlets/myProfile/UserStats";
import { InitiativesInRoleSections } from "pages/monitoring/outlets/myProfile/InitiativesInRoleSections";
import { uiText } from "pages/monitoring/outlets/myProfile/layout/uiText";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";

export function MyProfile() {
  const { userInitiativesAs } = useUserInMonitoringCTX();

  const isLeader = useMemo<boolean>(
    () =>
      userInitiativesAs[RoleInInitiative.LEADER] !== undefined &&
      userInitiativesAs[RoleInInitiative.LEADER]?.length > 0,
    [userInitiativesAs],
  );

  return (
    <main className="page-main [&>section]:w-full [&>section]:mb-4 lg:[&>section]:mb-8">
      <PageTitleUpdater title="Mis Iniciativas" subtitle="" />

      <header>
        <h3>{uiText.title}</h3>
      </header>

      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        aria-label={uiText.myAccountInfo.sr}
      >
        {uiText.myAccountInfo.label && <h4>{uiText.myAccountInfo.label}</h4>}
        <UserProfileCard />
        <UserStats />
      </section>

      {isLeader && (
        <section aria-label={uiText.manageInitiative.sr}>
          {uiText.myAccountInfo.label && (
            <h4>{uiText.manageInitiative.label}</h4>
          )}
          <InitiativeUpdater />
        </section>
      )}

      <InitiativesInRoleSections />
    </main>
  );
}
