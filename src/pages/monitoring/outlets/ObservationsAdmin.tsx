import { useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { PageTitleUpdater } from "@ui/PageTitleUpdater";

import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { InitiativesSearch } from "pages/monitoring/outlets/observationsAdmin/InitiativesSearch";
import { ObservationsList } from "pages/monitoring/outlets/observationsAdmin/ObservationsList";

export function ObservationsAdmin() {
  const [currentInitiative, setCurrentInitiative] =
    useState<InitiativeByLocation | null>(null);

  return (
    <main className="page-main">
      <PageTitleUpdater title="Administrar Observaciones" subtitle="" />

      <header>
        <h3>Administrar Observaciones</h3>
        <Button>Cargar Observaciones</Button>
      </header>

      <div className="w-full grid grid-cols-1 md:grid-cols-[30%_70%] gap-4">
        <InitiativesSearch
          currentInitiative={currentInitiative}
          setCurrentInitiative={setCurrentInitiative}
        />

        <ObservationsList fromInitiative={currentInitiative} />
      </div>
    </main>
  );
}
