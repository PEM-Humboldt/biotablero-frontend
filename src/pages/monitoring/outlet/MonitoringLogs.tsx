import { useState } from "react";
import { type CheckNLoadReturn } from "@appTypes/userLoader";

import { LogsSearchBar } from "pages/monitoring/outlet/monitoringLogs/LogsSearchBar";
import { LogsTable } from "pages/monitoring/outlet/monitoringLogs/LogsTable";
import { LogsPager } from "pages/monitoring/outlet/monitoringLogs/LogsPager";
import type {
  ODataParams,
  ODataLogEntryShort,
  ODataLog,
  LogEntryShort,
} from "pages/monitoring/types/requestParams";
import { useLoaderData } from "react-router";
import { getLogs } from "pages/monitoring/api/monitoringAPI";

type LoadedLogs = Awaited<CheckNLoadReturn<null, ODataLog>>;
export const LOGS_ELEMENT_ID = "logsElement";
export const FOCUSABLE_ELEMENTS: string[] = [
  "button",
  "[href]",
  "input",
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
];

function parseLogEntry(rawODataLog: ODataLogEntryShort): LogEntryShort {
  return {
    ...rawODataLog,
    timeStamp: new Date(rawODataLog.timeStamp),
  };
}

function parseODataLogs(odataLogs: ODataLog): LogEntryShort[] {
  const { value } = odataLogs;
  return value.map(parseLogEntry);
}

export function MonitoringLogs() {
  const preloadedLogs = useLoaderData<LoadedLogs>();
  const [logs, setLogs] = useState<ODataLog | null>(
    preloadedLogs?.criticalUserData ?? null,
  );

  const updateLogs = async (oDataParams: ODataParams) => {
    const updatedLogs = await getLogs(oDataParams);
    setLogs(updatedLogs);
  };

  return (
    <>
      <LogsSearchBar />
      <div
        id={LOGS_ELEMENT_ID}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {logs === null || logs.value.length === 0 ? (
          <h1>No hay logs disponibles</h1>
        ) : (
          <LogsTable
            recordsAmount={logs["@odata.count"]}
            records={parseODataLogs(logs)}
          />
        )}
        <LogsPager />
      </div>
    </>
  );
}
