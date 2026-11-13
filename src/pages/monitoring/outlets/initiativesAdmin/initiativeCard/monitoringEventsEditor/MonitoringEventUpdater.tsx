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
import { SquarePen } from "lucide-react";
import { uiText } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/layout/uiText";

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
        <Button
          size="icon-sm"
          variant="ghost-clean"
          title={uiText.eventsList.editPopup.triggerBtn.title}
          aria-label={uiText.eventsList.editPopup.triggerBtn.sr}
        >
          <SquarePen />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] lg:w-[450px] bg-input">
        <form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="[&_label]:text-balance [&_label]:font-normal"
        >
          <h4 className="sr-only">{uiText.eventsList.editPopup.titleSr}</h4>
          <LabeledInput
            inputName={`event_${eventDate}`}
            inputType="number"
            state={eventsCount}
            stateSetter={(value) => setEventsCount(Number(value))}
            validationErrors={errors}
            texts={uiText.eventsList.editPopup.inputTexts(eventDate)}
          />

          <div className="mt-4 flex flex-row-reverse flex-wrap gap-2 justify-between">
            <Button>{uiText.eventsList.editPopup.saveBtnLabel}</Button>

            <ButtonGroup>
              <Button type="reset" variant="outline_destructive">
                {uiText.eventsList.editPopup.resetBtnLabel}
              </Button>
              <Button
                type="button"
                variant="outline_destructive"
                onClick={() => setIsOpen(false)}
              >
                {uiText.eventsList.editPopup.cancelBtnLabel}
              </Button>
            </ButtonGroup>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
