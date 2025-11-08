import { isResponseRequestError } from "@api/auth";
import { monitoringAPI } from "pages/monitoring/api/monitoringAPI";
import type { LogEntryFull } from "pages/monitoring/types/requestParams";
import { useState } from "react";
import { createPortal } from "react-dom";
import { LOGS_ELEMENT_ID } from "@config/monitoring";
import { DetailCard } from "pages/monitoring/outlets/logs/table/showDetailBtn/DetailCard";

export function ShowLogDetailsButton({ value }: { value: unknown }) {
  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState<LogEntryFull | null>(null);
  const cardRender = document.getElementById(LOGS_ELEMENT_ID) ?? document.body;

  if (typeof value !== "string") {
    throw new Error(
      `Expected type of value: string, received: ${typeof value}`,
    );
  }

  const loadLogData = async () => {
    const logData = await monitoringAPI<LogEntryFull>({
      type: "get",
      endpoint: `Logs/${value}`,
    });

    if (isResponseRequestError(logData)) {
      setVisible(false);
      throw new Error(logData.message);
    }

    setVisible(true);
    setLog(logData);
  };

  return (
    <>
      <button onClick={() => void loadLogData()}>Detalles</button>
      {visible &&
        log &&
        createPortal(
          <DetailCard log={log} onClose={() => setVisible(false)} />,
          cardRender,
        )}
    </>
  );
}
