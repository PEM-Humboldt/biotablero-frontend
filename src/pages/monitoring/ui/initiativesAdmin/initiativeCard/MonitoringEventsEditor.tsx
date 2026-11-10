import { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
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

import {
  deleteMonitoringEvent,
  getMonitoringEventsByInitiative,
  updateMonitoringEvent,
} from "pages/monitoring/api/services/monitoringEvents";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

import {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
} from "pages/monitoring/types/initiative";
import { MonitoringEvent } from "pages/monitoring/types/monitoringEvents";
import { useCallback, useEffect, useRef, useState } from "react";
import { monitoringEventsSearchBarComponents } from "./layout/monitoringEventsSearchBarComponents";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { NewMonitoringEventForm } from "./monitoringEventsEditor/NewMonitoringEventForm";
import { MonitoringEventUpdater } from "./monitoringEventsEditor/MonitoringEventUpdater";

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

  const fetchMonitoringEvents = useCallback(async () => {
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
  }, [searchParams, initiative.id]);

  const handleMonitoringEventSortToggle = () => {
    setSearchParams((old) => ({
      ...old,
      orderby: old.orderby === "date asc" ? "date desc" : "date asc",
    }));
  };

  const handleCreateMonitoringEvent = async (date: Date, amount: number) => {
    console.log(date.toISOString(), amount);
  };

  const handleUpdateMonitoringEvent =
    (eventId: number) => async (eventsAmount: number, eventDate: Date) => {
      setIsLoading(true);
      setErrors([]);

      const res = await updateMonitoringEvent(eventId, eventsAmount, eventDate);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      void fetchMonitoringEvents();
    };

  const handleDeleteMonitoringEvent = async (eventId: number) => {
    setIsLoading(true);
    setErrors([]);

    const res = await deleteMonitoringEvent(eventId);
    setIsLoading(false);

    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    void fetchMonitoringEvents();
  };

  useEffect(() => {
    void fetchMonitoringEvents();
  }, [fetchMonitoringEvents]);

  useEffect(() => {
    setSearchParams((current) => ({ ...current, skip: 5 * (currentPage - 1) }));
  }, [currentPage]);

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

        <ErrorsList errorItems={errors} />

        <NewMonitoringEventForm create={handleCreateMonitoringEvent} />

        <div>
          <ODataSearchBar
            components={monitoringEventsSearchBarComponents}
            setSearchParams={setSearchParams}
            className="bg-accent *:flex-1!"
            submit="Filtrar"
            reset="Borrar filtro"
          />
          <Button onClick={handleMonitoringEventSortToggle}>
            Ordenar de mar recientes a mas lejanas{" "}
          </Button>
        </div>

        {monitoringEvents.length > 0 && (
          <ul>
            {monitoringEvents.map((event) => {
              const eventDate = new Date(event.date).toLocaleDateString(
                LOCALE,
                { year: "numeric", month: "long" },
              );

              return (
                <li key={event.id}>
                  <div>
                    fecha: {eventDate}
                    eventos: {event.value}
                  </div>
                  <div>
                    <MonitoringEventUpdater
                      event={event}
                      updater={handleUpdateMonitoringEvent(event.id)}
                    />
                    <Button
                      onClick={() => void handleDeleteMonitoringEvent(event.id)}
                    >
                      Borrar
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <DialogFooter className="lg:justify-center">
          <TablePager
            currentPage={currentPage}
            recordsAvailable={monitoringEventsCount.current}
            recordsPerPage={MONITORING_EVENTS_EDITOR_LIST_AMOUNT}
            onPageChange={setCurrentPage}
            paginated={1}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
