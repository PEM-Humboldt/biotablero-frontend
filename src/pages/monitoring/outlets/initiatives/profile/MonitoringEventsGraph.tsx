import { useCallback, useEffect, useMemo, useState } from "react";
import backgroundImage from "pages/home/assets/biotablero-slider.webp";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@ui/shadCN/component/select";
import { ResponsiveBar } from "@nivo/bar";
import {
  GRAPHS_GRADIENT_COLOR_PALETTE,
  INITIATIVE_MONITORING_EVENTS_HORIZONTAL_TICS,
} from "@config/monitoring";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Spinner } from "@ui/shadCN/component/spinner";

import { getInitiativeMonitoringEvents } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import type { InitiativeMonitoringEvent } from "pages/monitoring/types/stats";
import { getLocaleMonthString } from "pages/monitoring/utils/formatters";
import { uiText } from "pages/monitoring/outlets/initiatives/layout/uiText";
import { getContrastColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";

export function MonitoringEventsGraph() {
  const { initiativeId } = useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
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
      setSelectedYear(null);

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
      setMonitoringEventsData(availableYears);
    };

    void fetchYearsAvailable();
  }, [initiativeId]);

  const fetchMonitoringEvents = useCallback(
    async (year?: InitiativeMonitoringEvent["groupNumber"]) => {
      setIsLoading(true);
      const monitoringEvent = await getInitiativeMonitoringEvents(
        Number(initiativeId),
        year ?? undefined,
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
    void fetchMonitoringEvents(selectedYear || undefined);
  }, [fetchMonitoringEvents, selectedYear]);

  const formattedData = useMemo(() => {
    return monitoringEventsData.map((item) => ({
      ...item,
      groupName: getLocaleMonthString(item.groupName, true),
    }));
  }, [monitoringEventsData]);

  const computedMaxValue = useMemo(() => {
    if (formattedData.length === 0) {
      return "auto";
    }
    const maxEventValue = Math.max(...formattedData.map((d) => d.value));

    return maxEventValue < INITIATIVE_MONITORING_EVENTS_HORIZONTAL_TICS
      ? INITIATIVE_MONITORING_EVENTS_HORIZONTAL_TICS
      : maxEventValue + 1;
  }, [formattedData]);

  return (
    <div
      className="relative w-full py-10 bg-primary bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-primary mix-blend-color" />

      {years.length === 0 ? (
        <div className="p-2 w-2/3 text-3xl bg-primary rounded-lg text-primary-foreground text-center">
          {uiText.profile.monitoringEventsGraph.noEvents}
        </div>
      ) : (
        <section className="z-10 w-1/2 min-w-[300px] p-4 rounded-lg bg-background">
          <ErrorsList
            errorItems={errors}
            className="bg-accent/10 p-2 border rounded-lg border-accent m-2 mb-4"
          />
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2 items-center">
              <h4 className="m-0">
                {uiText.profile.monitoringEventsGraph.title(selectedYear)}
              </h4>
              {isLoading && <Spinner />}
            </div>

            <Select
              value={selectedYear !== null ? String(selectedYear) : "all"}
              onValueChange={(value) =>
                setSelectedYear(value === "all" ? null : Number(value))
              }
              disabled={years.length === 0}
              aria-label={uiText.profile.monitoringEventsGraph.selectYear.sr}
            >
              <SelectTrigger
                className="w-fit gap-2"
                title={uiText.profile.monitoringEventsGraph.selectYear.title}
              >
                <SelectValue
                  placeholder={
                    uiText.profile.monitoringEventsGraph.selectYear.placeholder
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  {uiText.profile.monitoringEventsGraph.selectYear.allYears}
                </SelectItem>
                {years.map((year) => (
                  <SelectItem
                    key={`monitoringEventYear_${year}`}
                    value={String(year)}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[200px]">
            <ResponsiveBar
              data={formattedData}
              indexBy="groupName"
              keys={["value"]}
              groupMode="grouped"
              margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
              padding={0.1}
              colors={GRAPHS_GRADIENT_COLOR_PALETTE[1]}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelPosition="start"
              labelOffset={12}
              labelTextColor={(bar) => getContrastColor(bar.color)}
              valueScale={{
                type: "linear",
                max: computedMaxValue,
              }}
              gridYValues={INITIATIVE_MONITORING_EVENTS_HORIZONTAL_TICS}
              axisLeft={{
                tickSize: 10,
                tickPadding: 5,
                tickRotation: 0,
                tickValues: INITIATIVE_MONITORING_EVENTS_HORIZONTAL_TICS,
                format: (value: string) =>
                  Number.isInteger(value) ? value : "",
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
      )}
    </div>
  );
}

function BarsTooltip({
  value,
  color,
  data,
}: {
  value: number;
  color: string;
  data: { groupName: string; groupNumber: number; value: number };
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
        <span>
          Monitoreos en {getLocaleMonthString(data.groupNumber, false, true)}
          :{" "}
        </span>
        <span className="font-normal">{value}</span>
      </div>
    </div>
  );
}
