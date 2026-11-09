import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { uiText } from "pages/monitoring/outlets/initiatives/territoryStories/layout/uiText";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import type { PanelState } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import { panelAccessButtons } from "pages/monitoring/outlets/initiatives/layout/territoryStoryPanels";

export function HeaderTS({
  currentPanel,
  goToPanel,
}: {
  currentPanel: PanelState;
  goToPanel: (newPanel: PanelState) => void;
}) {
  const { initiativeInfo } = useInitiativeCTX();

  const bannerUrl =
    (initiativeInfo?.bannerUrl as string) || uiText.header.imgFallback;

  return (
    <header
      className="relative w-full h-[120px] md:h-[260px] flex items-center justify-center overflow-hidden bg-primary"
      style={{
        backgroundImage: `url('${bannerUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 -bg-linear-300 from-primary to-transparent mix-blend-multiply" />

      <div className="w-full max-w-[1600px] p-4 z-10 text-3xl md:text-5xl font-bold text-primary-foreground">
        <div className="w-full max-w-[500px] text-balance">
          {uiText.header.text}
        </div>

        <ToggleTSAdminActions
          currentPanel={currentPanel}
          goToPanel={goToPanel}
        />
      </div>
    </header>
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
    <ButtonGroup className="mt-2">
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
  );
}
