import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { PanelState } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import { panelView } from "pages/monitoring/outlets/initiatives/layout/territoryStoryPanels";
import { TerritoryStoriesCTX } from "pages/monitoring/hooks/useTerritoryStoriesCTX";
import { HeaderTS } from "pages/monitoring/outlets/initiatives/territoryStories/HeaderTS";
import { TSAside } from "pages/monitoring/outlets/initiatives/territoryStories/TSAside";

export function TerritoryStories() {
  const { userStateInInitiative } = useInitiativeCTX();
  const [panel, setPanel] = useState<PanelState>(PanelState.READ);
  const navigate = useNavigate();
  const { initiativeId, tabSection } = useParams();

  useEffect(() => {
    if (
      userStateInInitiative !== UserStateInInitiative.USER_LEADER &&
      userStateInInitiative !== UserStateInInitiative.USER_PARTICIPANT
    ) {
      setPanel(PanelState.READ);
    }

    return () => {
      setPanel(PanelState.READ);
    };
  }, [userStateInInitiative]);

  const PanelComponent = panelView[panel];

  const handlePanelChange = (newPanel: PanelState) => {
    void navigate(
      initiativeId && tabSection
        ? `/Monitoreo/Iniciativas/${initiativeId}/${tabSection}`
        : "/Monitoreo/Iniciativas",
    );
    setPanel(newPanel);
  };

  return (
    <div className="flex flex-col items-center bg-grey-form w-full h-full">
      <TerritoryStoriesCTX>
        <HeaderTS currentPanel={panel} goToPanel={handlePanelChange} />

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] max-w-[1600px]">
          <main className="">
            <PanelComponent moveToPanel={setPanel} />
          </main>
          <TSAside />
        </div>
      </TerritoryStoriesCTX>
    </div>
  );
}
