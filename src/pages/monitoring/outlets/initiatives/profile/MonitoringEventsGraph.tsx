import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@ui/shadCN/component/select";
import { ResponsiveBar } from "@nivo/bar";

import { getInitiativeMonitoringEvents } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import type { InitiativeMonitoringEvent } from "pages/monitoring/types/stats";
import {
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD,
  INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP,
} from "@config/monitoring";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Spinner } from "@ui/shadCN/component/spinner";

const MONTHS_TRANSLATION_SHORT: Record<string, string> = {
  january: "Ene",
  february: "Feb",
  march: "Mar",
  april: "Abr",
  may: "May",
  june: "Jun",
  july: "Jul",
  august: "Ago",
  september: "Sep",
  october: "Oct",
  november: "Nov",
  december: "Dic",
};

const MONTHS_TRANSLATED_LONG: Record<string, string> = {
  Ene: "Enero",
  Feb: "Febrero",
  Mar: "Marzo",
  Abr: "Abril",
  May: "Mayo",
  Jun: "Junio",
  Jul: "Julio",
  Ago: "Agosto",
  Sep: "Septiembre",
  Oct: "Octubre",
  Nov: "Noviembre",
  Dic: "Diciembre",
};

const MONITORING_EVENTS_HORIZONTAL_TICS = 5;

export function MonitoringEventsGraph() {
  const { initiativeId } = useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [monitoringEventsData, setMonitoringEventsData] = useState<
    InitiativeMonitoringEvent[]
  >([]);

  useEffect(() => {
    const fetchYearsAvailable = async () => {
      if (!initiativeId) {
        return;
      }

      setIsLoading(true);
      setYears([]);

      const availableYears = await getInitiativeMonitoringEvents(
        Number(initiativeId),
      );
      setIsLoading(false);
      if (isMonitoringAPIError(availableYears)) {
        setErrors(availableYears.data.map((err) => err.msg));

        return;
      }

      const sortedYears = availableYears
        .toReversed()
        .map((year) => year.groupNumber);

      setYears(sortedYears);
      setCurrentYearIndex(0);
    };

    void fetchYearsAvailable();
  }, [initiativeId]);

  const fetchMonitoringEvents = useCallback(
    async (year?: InitiativeMonitoringEvent["groupNumber"]) => {
      if (!initiativeId || !year) {
        return;
      }

      setIsLoading(true);
      const monitoringEvent = await getInitiativeMonitoringEvents(
        Number(initiativeId),
        year,
      );

      setIsLoading(false);
      if (isMonitoringAPIError(monitoringEvent)) {
        setErrors(monitoringEvent.data.map((err) => err.msg));
        setMonitoringEventsData([]);
        return;
      }

      setMonitoringEventsData(monitoringEvent);
    },
    [initiativeId],
  );

  useEffect(() => {
    void fetchMonitoringEvents(years[currentYearIndex]);
  }, [fetchMonitoringEvents, currentYearIndex, years]);

  const formattedData = useMemo(() => {
    return monitoringEventsData.map((item) => {
      const lowerName = item.groupName.toLowerCase();
      return {
        ...item,
        groupName: MONTHS_TRANSLATION_SHORT[lowerName] || item.groupName,
      };
    });
  }, [monitoringEventsData]);

  const computedMaxValue = useMemo(() => {
    if (formattedData.length === 0) {
      return "auto";
    }
    const maxEventValue = Math.max(...formattedData.map((d) => d.value));

    return maxEventValue < MONITORING_EVENTS_HORIZONTAL_TICS
      ? MONITORING_EVENTS_HORIZONTAL_TICS
      : maxEventValue + 1;
  }, [formattedData]);

  return years.length === 0 ? (
    <div className="p-2 w-2/3 text-3xl bg-primary rounded-lg text-primary-foreground text-center">
      La iniciativa todavía no tiene eventos de monitoreo registrados
    </div>
  ) : (
    <section className="z-10 w-1/2 min-w-[300px] p-4 rounded-lg bg-background">
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 p-2 border rounded-lg border-accent m-2 mb-4"
      />
      <header className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <h4 className="m-0">
            Eventos de monitoreo {years[currentYearIndex]}
          </h4>
          {isLoading && <Spinner aria-label="cargando" />}
        </div>

        {years.length > 1 && (
          <Select
            value={String(currentYearIndex)}
            onValueChange={(value) => setCurrentYearIndex(Number(value))}
            disabled={years.length === 0}
            aria-label="Selecciona el año"
          >
            <SelectTrigger className="w-fit gap-2">
              <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>

            <SelectContent>
              {years.map((year, i) => (
                <SelectItem
                  key={`monitoringEventYear_${year}`}
                  value={String(i)}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </header>

      <div className="h-[200px]">
        <ResponsiveBar
          data={formattedData}
          indexBy="groupName"
          keys={["value"]}
          groupMode="grouped"
          margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
          padding={0.1}
          colors={INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[1]}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelPosition="start"
          labelOffset={12}
          labelTextColor={
            INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP[
              INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[1]
            ]
          }
          valueScale={{
            type: "linear",
            max: computedMaxValue,
          }}
          gridYValues={MONITORING_EVENTS_HORIZONTAL_TICS}
          axisLeft={{
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 0,
            tickValues: MONITORING_EVENTS_HORIZONTAL_TICS,
            format: (value: string) => (Number.isInteger(value) ? value : ""),
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          tooltip={BarsTooltip}
        />
      </div>
    </section>
  );
}

function BarsTooltip({
  id: _id,
  value,
  indexValue,
  color,
}: {
  id: string | number;
  value: number;
  indexValue: string | number;
  color: string;
}) {
  return (
    <div
      className="bg-background px-4 py-2 shadow-md rounded text-xs"
      style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span>Monitoreos en {MONTHS_TRANSLATED_LONG[indexValue]}: </span>
        <span className="font-normal">{value}</span>
      </div>
    </div>
  );
}
