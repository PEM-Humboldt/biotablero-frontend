import { useEffect, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { cn } from "@ui/shadCN/lib/utils";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { PanelState } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import {
  panelAccessButtons,
  panelView,
} from "pages/monitoring/outlets/initiatives/layout/territoryStoryPanels";
import { TerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";

export function TerritoryStorys() {
  const { userStateInInitiative } = useInitiativeCTX();
  const [panel, setPanel] = useState<PanelState>(PanelState.READ);

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

  return (
    <div className="flex flex-col items-center">
      <TerritoryStorysCTX>
        <header className="justify-end p-4 bg-grey w-full">
          Imagen del RT
        </header>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] w-full max-w-[1600px]">
          <main>
            <div className="bg-primary p-4 pl-8 ">busqueda</div>
            <div
              className={cn(panel !== PanelState.READ ? "bg-[#f5f5f5]" : "")}
            >
              <ToggleTSAdminActions currentPanel={panel} goToPanel={setPanel} />
              <PanelComponent />
            </div>
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
    <div className="p-4 flex justify-end gap-2">
      <ButtonGroup>
        {panelsAvailable.map(([panelKey, btnSettings]) => {
          return (
            <Button
              key={`panelSelector_${panelKey}`}
              variant="outline"
              onClick={() => goToPanel(panelKey)}
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
