import { JoinRequests } from "pages/monitoring/outlets/initiativesManagement/JoinRequest";
import { InitiativeUpdater } from "pages/monitoring/outlets/initiativesManagement/InitiativeUpdater";

export function InitiativesManagement() {
  return (
    <main className="page-main">
      <header>
        <h3>Tablero de iniciativas</h3>
      </header>

      <JoinRequests />
      <InitiativeUpdater />
    </main>
  );
}
