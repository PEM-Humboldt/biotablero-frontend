import { useEffect, useState, useRef } from "react";
import { useLoaderData } from "react-router";
import "pages/monitoring/outlets/logs/layout/logStyles.css";

import { ODataSearchBar } from "@composites/ODataSearchBar";
import { TablePager } from "@composites/TablePager";
import { LOG_RECORDS_PER_PAGE, LOGS_ELEMENT_ID } from "@config/monitoring";
import type { CheckNLoadReturn } from "@appTypes/userLoader";
import type { ODataParams } from "@appTypes/odata";
import { Button } from "@ui/shadCN/component/button";
import {
  LoadStatusMsgBar,
  type LoadStatusMsgBarProp,
} from "@ui/loadStatusSecction";

import {
  downloadLogs,
  getLogs,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import { searchBarItems } from "pages/monitoring/outlets/logs/layout/searchBarContent";
import { LogsTable } from "pages/monitoring/outlets/logs/Table";
import { uiText } from "pages/monitoring/outlets/logs/layout/uiText";
import type {
  ODataLogEntryShort,
  ODataLog,
  LogEntryShort,
} from "pages/monitoring/types/odataResponse";
import { FileDown } from "lucide-react";

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
  const [isDownloading, setIsDownloading] = useState(false);
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
    setIsDownloading(true);
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

        console.error(uiText.criticalError, err);
      } finally {
        setIsDownloading(false);
      }
    };

    void filterChange();
  }, [searchParams, currentPage]);

  const handleDownload = async () => {
    const { top: _top, skip: _skip, ...downloadParams } = searchParams;
    setIsDownloading(true);

    try {
      const result = await downloadLogs(downloadParams);

      if (isMonitoringAPIError(result)) {
        console.error(uiText.download.error, result.message);
        setLoadMsg({
          message: `${uiText.download.error}. ${uiText.download.tryAgain}`,
          type: "error",
        });
        return;
      }

      const url = window.URL.createObjectURL(result);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", uiText.download.filename);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(uiText.download.error, err);
      setLoadMsg({
        message: uiText.download.error,
        type: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const recordsAvailable = logs ? logs["@odata.count"] : 0;
  const downloadDisabled = logs && logs["@odata.count"] > 10_000;

  return (
    <main className="logs ml-[60px] bg-[#f5f5f5] p-4 *:max-w-6xl flex flex-col gap-4 items-center min-h-screen">
      <header className="p-6 pb-0 w-full flex justify-between items-center ml-[60px] max-w-6xl">
        <h3 className="h1! text-primary w-max">{uiText.logsTitle}</h3>
        <div className="max-w-[500px] text-right text-base">
          {downloadDisabled ? (
            uiText.download.warn
          ) : (
            <Button
              type="button"
              onClick={() => void handleDownload()}
              disabled={recordsAvailable === 0}
            >
              {isDownloading
                ? uiText.download.button.isDownloading
                : uiText.download.button.isReady}
              {!isDownloading && <FileDown aria-hidden="true" />}
            </Button>
          )}
        </div>
      </header>

      <ODataSearchBar
        components={searchBarItems}
        setSearchParams={setSearchParams}
        submit={uiText.searchBar.submitBtn}
        reset={uiText.searchBar.resetBtn}
        className="search-bar"
      />

      {loadMsg.message !== null ? (
        <LoadStatusMsgBar message={loadMsg.message} type={loadMsg.type} />
      ) : (
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
            recordsPerPage={LOG_RECORDS_PER_PAGE}
            paginated={3}
            className="table-pager"
          />
        </div>
      )}
    </main>
  );
}
