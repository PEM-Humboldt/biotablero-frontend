import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import type { LogEntryFull } from "pages/monitoring/types/odataResponse";
import { useState } from "react";
import { createPortal } from "react-dom";
import { LOGS_ELEMENT_ID } from "@config/monitoring";
import { DetailCard } from "pages/monitoring/outlets/logs/table/showDetailBtn/DetailCard";
import { uiText } from "pages/monitoring/outlets/logs/layout/uiText";

export function ShowLogDetailsButton({ value }: { value: unknown }) {
  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState<LogEntryFull | null>(null);
  const cardRender = document.getElementById(LOGS_ELEMENT_ID) ?? document.body;
  const [loadStatusMsg, setLoadStatusMsg] = useState<string | null>(null);

  if (typeof value !== "string") {
    throw new Error(
      `Expected type of value: string, received: ${typeof value}`,
    );
  }

  const loadLogData = async () => {
    try {
      setLoadStatusMsg(uiText.table.detailsBtn.loadStatus.loading);
      const logData = await monitoringAPI<LogEntryFull>({
        type: "get",
        endpoint: `Logs/${value}`,
      });

      if (isMonitoringAPIError(logData)) {
        throw new Error(logData.message);
      }

      setVisible(true);
      setLog(logData);
      setLoadStatusMsg(uiText.table.detailsBtn.loadStatus.loaded);
    } catch (err) {
      setVisible(false);
      setLoadStatusMsg(uiText.table.detailsBtn.loadStatus.error);
      console.error(err);
    }
  };

  return (
    <>
      <button
        onClick={() => void loadLogData()}
        disabled={loadStatusMsg !== null}
      >
        {loadStatusMsg !== null
          ? loadStatusMsg
          : uiText.table.detailsBtn.defaultText}
      </button>
      {visible &&
        log &&
        createPortal(
          <DetailCard log={log} onClose={() => setVisible(false)} />,
          cardRender,
        )}
    </>
  );
}
