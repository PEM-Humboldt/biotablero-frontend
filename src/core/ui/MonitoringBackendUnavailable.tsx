import { CircleAlert } from "lucide-react";

export function MonitoringBackendUnavailable() {
  return (
    <main className="flex h-full w-full items-center justify-center px-6 py-12">
      <section
        aria-labelledby="monitoring-backend-error-title"
        className="flex w-full max-w-xl flex-col items-center justify-center text-center"
      >
        <CircleAlert
          aria-hidden="true"
          size={96}
          strokeWidth={1}
          className="text-accent"
        />
        <h2 id="monitoring-backend-error-title" className="text-xl font-bold">
          Servicio temporalmente no disponible
        </h2>
        <p>
          No pudimos conectarnos con el servicio de monitoreo comunitario. Por
          favor, inténtalo de nuevo en unos momentos.
        </p>
      </section>
    </main>
  );
}
