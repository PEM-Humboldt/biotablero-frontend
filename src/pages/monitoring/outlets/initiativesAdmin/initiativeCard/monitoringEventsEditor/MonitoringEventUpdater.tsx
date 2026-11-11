import { LOCALE } from "@config/global";
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
import { ButtonGroup } from "@ui/shadCN/component/button-group";

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
    setErrors([]);

    const amountValidation = isAmountValid(eventsCount);
    if (amountValidation) {
      setErrors(amountValidation);
      return;
    }

    void updater(Number(eventsCount), new Date(event.date));
    startingAmountRef.current = eventsCount;
    setIsOpen(false);
  };

  const handleReset = () => {
    setErrors([]);
    setEventsCount(startingAmountRef.current);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>Editar</Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] lg:w-[450px]">
        <form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="[&_label]:text-balance [&_label]:font-normal"
        >
          <h4 className="sr-only">Actualizar eventos de monitoreo</h4>
          <LabeledInput
            inputName={`event_${eventDate}`}
            inputType="number"
            state={eventsCount}
            stateSetter={(value) => setEventsCount(Number(value))}
            validationErrors={errors}
            texts={{
              label: `¿Cuántos eventos de monitoreo se realizaron durante ${eventDate}?`,
              placeholder: "1, 5, 100...",
            }}
          />

          <div className="mt-4 flex flex-row-reverse flex-wrap gap-2 justify-between">
            <Button>Guardar</Button>

            <ButtonGroup>
              <Button type="reset" variant="outline_destructive">
                Reiniciar
              </Button>
              <Button
                type="button"
                variant="outline_destructive"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
            </ButtonGroup>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
