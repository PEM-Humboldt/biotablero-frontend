import { JoinRequests } from "pages/monitoring/outlets/myProfile/JoinRequest";
import { InitiativeUpdater } from "pages/monitoring/outlets/myProfile/InitiativeUpdater";

export function MyProfile() {
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
