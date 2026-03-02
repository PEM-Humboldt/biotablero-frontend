import { useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/shadCN/component/dialog";

import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { LogEntryFull } from "pages/monitoring/types/requestParams";
import { uiText } from "pages/monitoring/outlets/logs/layout/uiText";
import { fetchLogDetails } from "pages/monitoring/api/services/logs";

export function ShowLogDetailsButton({ value }: { value: unknown }) {
  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState<LogEntryFull | null>(null);
  const [loadStatusMsg, setLoadStatusMsg] = useState<string | null>(null);

  if (typeof value !== "string") {
    throw new Error(
      `Expected type of value: string, received: ${typeof value}`,
    );
  }

  const loadLogData = async () => {
    try {
      setLoadStatusMsg(uiText.table.detailsBtn.loadStatus.loading);
      const logData = await fetchLogDetails(value);

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

  const makeReadableDate = (dateStr: Date) => {
    const logDate = new Date(dateStr);
    return `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString()}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => void loadLogData()}
          disabled={loadStatusMsg !== null}
          variant="ghost"
        >
          {loadStatusMsg !== null
            ? loadStatusMsg
            : uiText.table.detailsBtn.defaultText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] flex flex-col p-4 md:p-8 overflow-hidden">
        {visible && log && (
          <>
            <div className="pb-2">
              <DialogHeader>
                <DialogTitle>Registro del sistema</DialogTitle>
              </DialogHeader>
              <DialogDescription>Detalles del log {log.id}</DialogDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 [&>p]:m-0 [&>p]:flex [&>p]:flex-col [&>p>span]:first:font-semibold [&>p>span]:first:text-primary">
              <p>
                <span>Id</span>
                <span>{log.id}</span>
              </p>
              <p>
                <span>Fecha y hora</span>
                <span>{makeReadableDate(log.timeStamp)}</span>
              </p>
              <p>
                <span>Tipo</span>
                <span>{log.type}</span>
              </p>
              <p>
                <span>Mensaje corto</span>
                <span className="truncate">{log.shortMessage}</span>
              </p>
              <p>
                <span>Navegador</span>
                <span className="break-all">{log.clientAgent}</span>
              </p>
              <p>
                <span>Dirección IP</span>
                <span>{log.clientIp}</span>
              </p>
            </div>

            <span className="font-semibold text-primary">Descripción</span>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="bg-muted/50 rounded-md whitespace-pre-wrap leading-relaxed">
                {log.message}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
