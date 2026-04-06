import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { PanelState } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import {
  panelAccessButtons,
  panelView,
} from "pages/monitoring/outlets/initiatives/layout/territoryStoryPanels";
import { TerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { HeaderTS } from "pages/monitoring/outlets/initiatives/territoryStories/HeaderTS";

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
    <div className="flex flex-col items-center bg-grey-form">
      <TerritoryStorysCTX>
        <HeaderTS />

        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] w-full max-w-[1600px]">
          <main className="">
            <ToggleTSAdminActions
              currentPanel={panel}
              goToPanel={handlePanelChange}
            />

            <PanelComponent moveToPanel={setPanel} />
          </main>
          <aside className="bg-accent">barra lateral</aside>
        </div>
      </TerritoryStorysCTX>
    </div>
  );
}

function ToggleTSAdminActions({
  currentPanel,
  goToPanel,
}: {
  currentPanel: PanelState;
  goToPanel: (newPanel: PanelState) => void;
}) {
  const { userStateInInitiative } = useInitiativeCTX();

  if (
    userStateInInitiative !== UserStateInInitiative.USER_LEADER &&
    userStateInInitiative !== UserStateInInitiative.USER_PARTICIPANT
  ) {
    return null;
  }

  const panelsAvailable = [...panelAccessButtons].filter(
    ([key, _]) => key !== currentPanel,
  );

  return (
    <div className="p-4 pb-0 flex justify-end gap-2">
      <ButtonGroup>
        {panelsAvailable.map(([panelKey, btnSettings]) => {
          return (
            <Button
              key={`panelSelector_${panelKey}`}
              variant="outline"
              onClick={() => goToPanel(panelKey)}
              title={btnSettings.title}
            >
              <span className="sr-only">{btnSettings.sr}</span>
              <span aria-hidden="true">{btnSettings.label}</span>
              <btnSettings.icon />
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}
