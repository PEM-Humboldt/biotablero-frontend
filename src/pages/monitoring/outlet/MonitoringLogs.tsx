import { useEffect, useState } from "react";

import { LogsSearchBar } from "pages/monitoring/outlet/monitoringLogs/LogsSearchBar";
import { LogsTable } from "pages/monitoring/outlet/monitoringLogs/LogsTable";
import type {
  ODataParams,
  ODataLogEntry,
  ODataLog,
  LogEntry,
} from "pages/monitoring/types/requestParams";
import { getLogs } from "pages/monitoring/api/monitoringAPI";

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
  const [searchQuery, setSearchQuery] = useState<ODataParams>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const carai = async () => {
      const rawLogs = await getLogs(searchQuery);
      const cleanLogs = parseODataLogs(rawLogs);
      setLogs(cleanLogs);
    };

    void carai();
  }, [searchQuery]);

  console.log(logs);
  return (
    <>
      <LogsSearchBar />
      <LogsTable />
    </>
  );
}
