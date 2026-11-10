import { Button } from "@ui/shadCN/component/button";
import { FormEvent, useState } from "react";
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

const curretnYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const years = Array.from(
  { length: curretnYear - MONITORING_STARTING_YEAR + 1 },
  (_, i) => curretnYear - i,
);

export function NewMonitoringEventForm({
  create,
}: {
  create: (date: Date, amount: number) => Promise<void>;
}) {
  const [month, setMonth] = useState(months[currentMonth].value);
  const [year, setYear] = useState(String(curretnYear));
  const [newEventAmount, setNewEventAmount] = useState(0);

  const handleResetForm = () => {
    setNewEventAmount(0);
    setYear(String(curretnYear));
    setMonth(months[currentMonth].value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create(new Date(`${year}-${month}`), newEventAmount);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleResetForm}>
      Crear nuevo grupo de eventos de monitoreo comunitario
      <LabeledInput
        inputName={`newEventAmount`}
        inputType="number"
        required={true}
        state={newEventAmount}
        stateSetter={(value) => setNewEventAmount(Number(value))}
        validationErrors={[]}
        texts={{
          label: `¿Cuántos eventos de monitoreo se realizaron?`,
          placeholder: "1, 5, 25...",
        }}
      />
      <fieldset>
        <legend>¿Cuándo sucedieron los eventos de monitoreo?</legend>
        <div className="flex gap-2">
          <Select value={year} onValueChange={(e) => setYear(e)}>
            <SelectTrigger>
              <SelectValue placeholder="Año" />
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
            <SelectTrigger>
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>
      <div>
        <Button>Crear</Button>
        <Button type="reset">Reiniciar</Button>
      </div>
    </form>
  );
}
