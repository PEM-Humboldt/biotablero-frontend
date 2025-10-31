import { useState } from "react";

import { LogsSearchBar } from "pages/monitoring/outlet/monitoringLogs/LogsSearchBar";
import { LogsTable } from "pages/monitoring/outlet/monitoringLogs/LogsTable";
import type {
  ODataParams,
  ODataLogEntry,
  ODataLog,
  LogEntry,
} from "pages/monitoring/types/requestParams";
import { useLoaderData } from "react-router";
import { type CheckNLoadReturn } from "@utils/userLoader";
import { getLogs } from "pages/monitoring/api/monitoringAPI";

type LoadedLogs = Awaited<CheckNLoadReturn<null, ODataLog>>;

function parseLogEntry(rawODataLog: ODataLogEntry): LogEntry {
  return {
    ...rawODataLog,
    timeStamp: new Date(rawODataLog.timeStamp),
    properties: JSON.parse(rawODataLog.properties) as Record<string, unknown>,
  };
}

function parseODataLogs(odataLogs: ODataLog): LogEntry[] {
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
      {logs === null || logs.value.length === 0 ? (
        <h1>No hay logs disponibles</h1>
      ) : (
        <LogsTable
          recordsAmount={logs["@odata.count"]}
          records={parseODataLogs(logs)}
        />
      )}
    </>
  );
}
