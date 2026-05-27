import { JoinRequests } from "pages/monitoring/outlets/myProfile/JoinRequest";
import { InitiativeUpdater } from "pages/monitoring/outlets/myProfile/InitiativeUpdater";

export function MyProfile() {
  return (
    <main className="page-main [&>section]:w-full">
      <header>
        <h3>Mi Perfíl</h3>
      </header>

      <section className="bg-accent">
        <h3>Información de mi cuenta</h3>
        <div>usuario</div>
        <div>
          estadisticas
          <div>Tarjeta de estadistica</div>
        </div>
      </section>

      <section>
        <h3 className="sr-only">Administración de iniciativas</h3>
        <JoinRequests />
        <InitiativeUpdater />
      </section>

      <section aria-labelledby="heading-leader">
        <h3 id="heading-leader" aria-label="Iniciativas que lidero">
          lider
        </h3>
        <div>Tarjeta de iniciativa</div>
      </section>

      <section aria-labelledby="heading-collaborator">
        <h3
          id="heading-collaborator"
          aria-label="Iniciativas en las que colaboro"
        >
          Collaborador
        </h3>
        <div>Tarjeta de iniciativa</div>
      </section>

      <section aria-labelledby="heading-observer">
        <h3 id="heading-observer" aria-label="Iniciativas que observo">
          Collaborador
        </h3>
        <div>Tarjeta de observador</div>
      </section>
    </main>
  );
}
