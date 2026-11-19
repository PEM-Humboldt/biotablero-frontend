import { Button } from "@ui/shadCN/component/button";
import { FormEvent, useMemo, useState } from "react";
import { LabeledInput } from "@ui/LabeledInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadCN/component/select";
import { MONITORING_STARTING_YEAR } from "@config/monitoring";
import { months } from "@utils/dates";
import {
  isAmountValid,
  isNewEvent,
} from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/utils/formMonitoringEventsValidations";
import { ErrorsList, LegendAndErrors } from "@ui/LabelingWithErrors";
import { createMonitoringEvent } from "pages/monitoring/api/services/monitoringEvents";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { uiText } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/layout/uiText";

const curretnYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const years = Array.from(
  { length: curretnYear - MONITORING_STARTING_YEAR + 1 },
  (_, i) => curretnYear - i,
);

export function NewMonitoringEventForm({
  initiativeId,
  onSuccess,
}: {
  initiativeId: number;
  onSuccess: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<"amount" | "date" | "root", string[]>>
  >({});
  const [month, setMonth] = useState(months[currentMonth].value);
  const [year, setYear] = useState(String(curretnYear));
  const [newEventAmount, setNewEventAmount] = useState(0);

  const handleResetForm = () => {
    setErrors({});
    setNewEventAmount(0);
    setYear(String(curretnYear));
    setMonth(months[currentMonth].value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const amountValidation = isAmountValid(newEventAmount);
    if (amountValidation) {
      setErrors({ amount: amountValidation });
      return;
    }

    setIsLoading(true);
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    const isNewEventValid = await isNewEvent(initiativeId, date);

    if (isNewEventValid) {
      setErrors({ date: isNewEventValid });
      setIsLoading(false);
      return;
    }

    const res = await createMonitoringEvent(initiativeId, date, newEventAmount);
    setIsLoading(false);
    if (isMonitoringAPIError(res)) {
      setErrors({ root: res.data.map((err) => err.msg) });
      return;
    }

    handleResetForm();
    void onSuccess();
  };

  const monthsAvailable = useMemo(
    () =>
      year === String(curretnYear) ? months.slice(0, currentMonth + 1) : months,
    [year],
  );

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleResetForm}
      className="p-4 border border-primary/10 hover:border-primary animate-color duration-300 bg-muted rounded-lg [&_label]:text-primary [&_label]:font-normal space-y-2"
    >
      <h4 className="text-primary text-balance text-xl">
        {uiText.newEventForm.title}
      </h4>

      <LabeledInput
        inputName={`newEventAmount`}
        inputType="number"
        state={newEventAmount}
        stateSetter={(value) => setNewEventAmount(Number(value))}
        validationErrors={errors.amount ?? []}
        texts={uiText.newEventForm.amountInput}
      />
      <fieldset>
        <LegendAndErrors
          validationErrors={errors.date ?? []}
          className="text-base"
        >
          {uiText.newEventForm.dateLegend}
        </LegendAndErrors>

        <div className="flex gap-2">
          <Select value={year} onValueChange={(e) => setYear(e)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={uiText.newEventForm.yearPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={(e) => setMonth(e)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={uiText.newEventForm.monthPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {monthsAvailable.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>
      <div>
        <ErrorsList errorItems={errors.root ?? []} />

        <div className="flex flex-row-reverse flex-wrap gap-2 mt-6 justify-between">
          <Button
            disabled={isLoading}
            title={uiText.newEventForm.createBtn.title(isLoading)}
            aria-label={uiText.newEventForm.createBtn.sr(isLoading)}
          >
            {uiText.newEventForm.createBtn.label(isLoading)}
          </Button>

          <Button
            type="reset"
            variant="outline_destructive"
            title={uiText.newEventForm.resetBtn.title}
            aria-label={uiText.newEventForm.resetBtn.sr}
          >
            {uiText.newEventForm.resetBtn.label}
          </Button>
        </div>
      </div>
    </form>
  );
}
