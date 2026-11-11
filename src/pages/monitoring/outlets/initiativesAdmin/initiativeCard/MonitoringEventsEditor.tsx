import { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { TablePager } from "@composites/TablePager";
import { LOCALE } from "@config/global";
import { MONITORING_EVENTS_EDITOR_LIST_AMOUNT } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";

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
import { monitoringEventsSearchBarComponents } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/layout/monitoringEventsSearchBarComponents";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { NewMonitoringEventForm } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/NewMonitoringEventForm";
import { MonitoringEventUpdater } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/MonitoringEventUpdater";
import { LoadingDiv } from "@ui/LoadingDiv";
import { CalendarArrowDown, CalendarArrowUp, Trash2 } from "lucide-react";
import { Spinner } from "@ui/shadCN/component/spinner";

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
    orderby: "date desc",
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
    <div className="p-2">
      <div>
        <h4 className="text-2xl text-primary">
          Administrar los eventos de monitoreo comunitario
        </h4>
        <p className="sr-only">
          Agrega, edita o elimina eventos de monitoreo comunitario realizados
          por la iniciativa '{initiative.name}'
        </p>

        {monitoringEvents.length === 0 && isLoading && (
          <LoadingDiv className="mb-2" />
        )}

        <ErrorsList
          errorItems={errors}
          className="bg-accent/10 p-2 mb-2 rounded-lg border border-accent"
        />
      </div>

      <div className="flex flex-wrap gap-4 *:flex-1 items-start">
        <NewMonitoringEventForm
          initiativeId={initiative.id}
          onSuccess={fetchMonitoringEvents}
        />

        {monitoringEvents.length > 0 && (
          <div className="p-4 rounded-lg border border-primary/10 hover:border-primary animate-color duration-300">
            <h4 className="text-primary text-balance text-xl">
              Eventos de monitoreo registrados en la iniciativa
            </h4>

            <div className="bg-muted rounded-lg flex gap-2 items-end p-4">
              <ODataSearchBar
                components={monitoringEventsSearchBarComponents}
                setSearchParams={setSearchParams}
                className="m-0 p-0 flex-col items-stretch lg:flex-row lg:items-end"
                submit="Filtrar"
              />
              <Button
                size="icon"
                onClick={handleMonitoringEventSortToggle}
                title={
                  searchParams.orderby === "date asc"
                    ? "Ordenar del más reciente al más lejano"
                    : "Ordenar del más lejano al más reciente"
                }
                aria-label={
                  searchParams.orderby === "date asc"
                    ? "Ordenar del más reciente al más lejano"
                    : "Ordenar del más lejano al más reciente"
                }
              >
                {searchParams.orderby === "date asc" ? (
                  <CalendarArrowDown />
                ) : (
                  <CalendarArrowUp />
                )}
              </Button>
            </div>

            <ul className="my-2">
              {monitoringEvents.map((event) => {
                const date = new Date(event.date);
                const dateLabel = date.toISOString();
                const eventDate = date.toLocaleDateString(LOCALE, {
                  year: "numeric",
                  month: "long",
                  timeZone: "UTC",
                });

                return (
                  <li
                    key={event.id}
                    className="px-2 rounded hover:bg-muted even:bg-muted/30 flex [&>div]:first:flex-1 items-center"
                  >
                    <div>
                      <span className="font-normal">{event.value}</span> eventos
                      durante <time dateTime={dateLabel}>{eventDate}</time>
                    </div>
                    <div>
                      <MonitoringEventUpdater
                        event={event}
                        updater={handleUpdateMonitoringEvent(event.id)}
                      />
                      <Button
                        onClick={() =>
                          void handleDeleteMonitoringEvent(event.id)
                        }
                        size="icon-sm"
                        variant="ghost-clean"
                        title="Borrar grupo de eventos de monitoreo"
                        aria-label="Borrar grupo de eventos de monitoreo"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <TablePager
              currentPage={currentPage}
              recordsAvailable={monitoringEventsCount.current}
              recordsPerPage={MONITORING_EVENTS_EDITOR_LIST_AMOUNT}
              onPageChange={setCurrentPage}
              paginated={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
