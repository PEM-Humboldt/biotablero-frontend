import { CircleAlert } from "lucide-react";

export function MonitoringBackendUnavailable() {
  return (
    <main className="flex h-full w-full items-center justify-center bg-muted px-6 py-12">
      <section
        aria-labelledby="monitoring-backend-error-title"
        className="w-full max-w-xl rounded-xl border border-primary/20 bg-background p-8 text-center shadow-lg sm:p-12"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary"
        >
          <CircleAlert size={32} strokeWidth={1} />
        </div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Monitoreo comunitario
        </p>
        <h1
          id="monitoring-backend-error-title"
          className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
        >
          Servicio temporalmente no disponible
        </h1>
        <p className="mb-0 text-base text-muted-foreground sm:text-lg">
          No pudimos conectarnos con el servicio de monitoreo comunitario. Por
          favor, inténtalo de nuevo en unos momentos.
        </p>
      </section>
    </main>
  );
}
