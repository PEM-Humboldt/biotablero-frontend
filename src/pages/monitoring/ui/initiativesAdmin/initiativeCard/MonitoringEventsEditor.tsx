import { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { TablePager } from "@composites/TablePager";
import { LOCALE } from "@config/global";
import {
  MONITORING_EVENTS_EDITOR_LIST_AMOUNT,
  MONITORING_EVENTS_MAX_PER_MONTH,
  MONITORING_EVENTS_MIN_PER_MONTH,
} from "@config/monitoring";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";

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
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { monitoringEventsSearchBarComponents } from "./layout/monitoringEventsSearchBarComponents";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LabeledInput } from "@ui/LabeledInput";

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

  useEffect(() => {
    void fetchMonitoringEvents();
  }, [fetchMonitoringEvents]);

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
        // NOTE: Agregar form para añadir evento de monitoreo
        <br />
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

function MonitoringEventUpdater({
  event,
  updater,
}: {
  event: MonitoringEvent;
  updater: (newAmount: number, date: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [eventsCount, setEventsCount] = useState(event.value);
  const startingAmountRef = useRef(event.value);
  const [errors, setErrors] = useState<string[]>([]);

  const eventDate = new Date(event.date).toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid =
      eventsCount >= MONITORING_EVENTS_MIN_PER_MONTH &&
      eventsCount <= MONITORING_EVENTS_MAX_PER_MONTH;

    if (!isValid) {
      setErrors([
        `debes ingresar un numero entre ${MONITORING_EVENTS_MIN_PER_MONTH} y ${MONITORING_EVENTS_MAX_PER_MONTH}`,
      ]);
      return;
    }

    void updater(Number(eventsCount), new Date(event.date));
    setIsOpen(false);
  };

  const handleReset = () => {
    setEventsCount(startingAmountRef.current);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>Editar</Button>
      </PopoverTrigger>

      <PopoverContent>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <h4>Actualizar eventos de monitoreo</h4>
          <LabeledInput
            inputName={`event_${eventDate}`}
            inputType="number"
            required={true}
            state={eventsCount}
            stateSetter={(value) => setEventsCount(Number(value))}
            validationErrors={errors}
            texts={{
              label: `¿Cuántos eventos de monitoreo se realizaron durante ${eventDate}?`,
              placeholder: "1, 5, 100...",
            }}
          />

          <div>
            <Button>Guardar</Button>
            <Button type="reset">Reiniciar</Button>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
