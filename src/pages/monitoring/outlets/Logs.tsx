import { useEffect, useState, useRef } from "react";
import { useLoaderData } from "react-router";
import "pages/monitoring/outlets/logs/layout/logStyles.css";

import { ODataSearchBar } from "@composites/ODataSearchBar";
import { TablePager } from "@composites/TablePager";
import { LOG_RECORDS_PER_PAGE, LOGS_ELEMENT_ID } from "@config/monitoring";
import type { CheckNLoadReturn } from "@appTypes/userLoader";
import type { ODataParams } from "@appTypes/odata";

import { getLogs } from "pages/monitoring/api/monitoringAPI";
import { searchBarItems } from "pages/monitoring/outlets/logs/layout/searchBarContent";
import { LogsTable } from "pages/monitoring/outlets/logs/Table";
import { uiText } from "pages/monitoring/outlets/logs/layout/uiText";
import type {
  ODataLogEntryShort,
  ODataLog,
  LogEntryShort,
} from "pages/monitoring/types/requestParams";
import {
  LoadStatusMsgBar,
  type LoadStatusMsgBarProp,
} from "@ui/loadStatusSecction";

type LoadedLogs = Awaited<CheckNLoadReturn<null, ODataLog>>;

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

export function Logs() {
  const preloadedLogs = useLoaderData<LoadedLogs>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [logs, setLogs] = useState<ODataLog | null>(
    preloadedLogs?.criticalUserData ?? null,
  );
  const [loadMsg, setLoadMsg] = useState<LoadStatusMsgBarProp>({
    message: uiText.logLoadingStates.loading,
    type: "normal",
  });
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: LOG_RECORDS_PER_PAGE,
    orderby: "timeStamp desc",
  });
  const prevSearchParamsRef = useRef(searchParams);

  useEffect(() => {
    const filterChange = async () => {
      if (prevSearchParamsRef.current !== searchParams) {
        setCurrentPage(1);
        prevSearchParamsRef.current = searchParams;
      }

      setLoadMsg({
        message: uiText.logLoadingStates.loading,
        type: "normal",
      });
      const skip = (currentPage - 1) * LOG_RECORDS_PER_PAGE;
      const newSearchParams = {
        ...searchParams,
        skip: skip,
      };

      try {
        const updatedLogs = await getLogs(newSearchParams);
        setLogs(updatedLogs);
        setLoadMsg({
          message: null,
          type: "normal",
        });
      } catch (err) {
        setLoadMsg({
          message: uiText.logLoadingStates.error,
          type: "error",
        });

        if (err instanceof Error) {
          throw err;
        }
        throw new Error("Unknown error, cannot fetch logs data");
      }
    };

    void filterChange();
  }, [searchParams, currentPage]);

  const recordsAvailable = logs ? logs["@odata.count"] : 0;

  return (
    <main className="logs">
      <header>
        <h2>{uiText.logsTitle}</h2>
      </header>
      <ODataSearchBar
        components={searchBarItems}
        setSearchParams={setSearchParams}
        submit={uiText.searchBar.submitBtn}
        reset={uiText.searchBar.resetBtn}
        className="search-bar"
      />
      <LoadStatusMsgBar message={loadMsg.message} type={loadMsg.type} />
      <div id={LOGS_ELEMENT_ID}>
        {logs === null || logs.value.length === 0 ? (
          <p>{uiText.noLogsAvailable}</p>
        ) : (
          <LogsTable records={parseODataLogs(logs)} />
        )}
        <TablePager
          currentPage={currentPage}
          recordsAvailable={recordsAvailable}
          onPageChange={setCurrentPage}
          buttons={uiText.pager.buttons}
          texts={uiText.pager.texts}
          recordsPerPage={LOG_RECORDS_PER_PAGE}
          paginated={3}
          className="table-pager"
        />
      </div>
    </main>
  );
}
