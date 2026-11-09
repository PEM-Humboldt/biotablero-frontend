import { ODataParams } from "@appTypes/odata";
import { TablePager } from "@composites/TablePager";
import { LOCALE } from "@config/global";
import { MONITORING_EVENTS_EDITOR_LIST_AMOUNT } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@ui/shadCN/component/dialog";
import { getMonitoringEventsByInitiative } from "pages/monitoring/api/services/monitoringEvents";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

import {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
} from "pages/monitoring/types/initiative";
import { MonitoringEvent } from "pages/monitoring/types/monitoringEvents";
import { useEffect, useRef, useState } from "react";

export function MonitoringEventsEditor({
  initiative,
}: {
  initiative: InitiativeDisplayInfoShort | InitiativeDisplayInfo;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [monitoringEvents, setMonitoringEvents] = useState<MonitoringEvent[]>(
    [],
  );
  const monitoringEventsCount = useRef(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: MONITORING_EVENTS_EDITOR_LIST_AMOUNT,
    orderby: "date asc",
  });

  useEffect(() => {
    setSearchParams((current) => ({ ...current, skip: 5 * (currentPage - 1) }));
  }, [currentPage]);

  useEffect(() => {
    const fetchMonitoringEvents = async () => {
      setIsLoading(true);
      const res = await getMonitoringEventsByInitiative(initiative.id)(
        searchParams,
      );
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      monitoringEventsCount.current = res["@odata.count"];
      setMonitoringEvents(res.value);
    };

    void fetchMonitoringEvents();
  }, [initiative.id, searchParams]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!initiative.enabled}>
          Eventos de monitoreo
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eventos de monitoreo comunitario</DialogTitle>
          <DialogDescription className="sr-only">
            Agrega, edita o elimina eventos de monitoreo comunitario realizados
            por la iniciativa '{initiative.name}'
          </DialogDescription>
        </DialogHeader>
        // NOTE: Agregar form para añadir evento de monitoreo
        <br />
        // NOTE: Agregar buscador por fechas
        {monitoringEvents.length > 0 ? (
          <ul>
            {monitoringEvents.map((event) => {
              const eventDate = new Date(event.date).toLocaleDateString(
                LOCALE,
                { year: "numeric", month: "long" },
              );

              return (
                <li>
                  <div>
                    fecha: {eventDate}
                    eventos: {event.value}
                  </div>
                  <div>
                    <Button>Editar</Button>
                    <Button>Borrar</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "Esta iniciativa todavía no tiene eventos de monitoreo registrados"
        )}
        <DialogFooter className="lg:justify-center">
          <TablePager
            currentPage={currentPage}
            recordsAvailable={monitoringEventsCount.current}
            recordsPerPage={5}
            onPageChange={setCurrentPage}
            paginated={MONITORING_EVENTS_EDITOR_LIST_AMOUNT}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
