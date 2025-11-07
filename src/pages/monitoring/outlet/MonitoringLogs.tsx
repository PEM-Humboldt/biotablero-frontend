import { useEffect, useState } from "react";
import { type CheckNLoadReturn } from "@appTypes/userLoader";

import { ODataSearchBar } from "@composites/ODataSearchBar";
import { LogsTable } from "pages/monitoring/outlet/monitoringLogs/LogsTable";
import { LogsPager } from "pages/monitoring/outlet/monitoringLogs/LogsPager";
import type { ODataParams } from "@appTypes/odata";
import type {
  ODataLogEntryShort,
  ODataLog,
  LogEntryShort,
} from "pages/monitoring/types/requestParams";
import { useLoaderData } from "react-router";
import { getLogs } from "pages/monitoring/api/monitoringAPI";
import { searchComponents } from "pages/monitoring/outlet/monitoringLogs/layout/searchBarContent";

type LoadedLogs = Awaited<CheckNLoadReturn<null, ODataLog>>;
export const LOGS_ELEMENT_ID = "logsElement";

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
  const [searchParams, setSearchParams] = useState<ODataParams>({
    orderby: "timeStamp desc",
  });

  const updateLogs = async (oDataParams: ODataParams) => {
    const updatedLogs = await getLogs(oDataParams);
    setLogs(updatedLogs);
  };

  useEffect(() => {
    const filterChange = async () => {
      await updateLogs(searchParams);
    };

    void filterChange();
  }, [searchParams]);

  return (
    <>
      <ODataSearchBar
        setSearchParams={setSearchParams}
        components={searchComponents}
      />
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
