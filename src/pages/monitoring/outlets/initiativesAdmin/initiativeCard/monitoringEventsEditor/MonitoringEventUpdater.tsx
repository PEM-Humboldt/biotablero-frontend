import { LOCALE } from "@config/global";
import {
  MONITORING_EVENTS_MAX_PER_MONTH,
  MONITORING_EVENTS_MIN_PER_MONTH,
} from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";

import { MonitoringEvent } from "pages/monitoring/types/monitoringEvents";
import { FormEvent, useRef, useState } from "react";
import { LabeledInput } from "@ui/LabeledInput";
import { isAmountValid } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/utils/formMonitoringEventsValidations";

export function MonitoringEventUpdater({
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

    if (!isAmountValid(eventsCount)) {
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
