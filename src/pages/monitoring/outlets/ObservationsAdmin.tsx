import { useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { PageTitleUpdater } from "@ui/PageTitleUpdater";

import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { InitiativesSearch } from "pages/monitoring/outlets/observationsAdmin/InitiativesSearch";
import { ObservationsList } from "pages/monitoring/outlets/observationsAdmin/ObservationsList";
import { uiText } from "./observationsAdmin/layout/uiText";

export function ObservationsAdmin() {
  const [currentInitiative, setCurrentInitiative] =
    useState<InitiativeByLocation | null>(null);

  return (
    <main className="page-main">
      <PageTitleUpdater {...uiText.mainHeader.pageTitle} />

      <header>
        <h3>{uiText.mainHeader.title}</h3>
        <Button
          title={uiText.mainHeader.uploadObservationBtn.title}
          aria-label={uiText.mainHeader.uploadObservationBtn.title}
        >
          {uiText.mainHeader.uploadObservationBtn.label}
        </Button>
      </header>

      <div className="w-full grid grid-cols-1 md:grid-cols-[30%_70%] gap-4">
        <InitiativesSearch
          currentInitiative={currentInitiative}
          setCurrentInitiative={setCurrentInitiative}
        />

        <div className="p-4 bg-background rounded-lg space-y-4">
          {!currentInitiative ? (
            uiText.observationsList.noInitiative
          ) : (
            <ObservationsList fromInitiative={currentInitiative} />
          )}
        </div>
      </div>
    </main>
  );
}
