import { isResponseRequestError } from "@api/auth";
import { monitoringAPI } from "pages/monitoring/api/monitoringAPI";
import type { LogEntryFull } from "pages/monitoring/types/requestParams";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LOGS_ELEMENT_ID } from "pages/monitoring/outlet/MonitoringLogs";

export function LogDetailsAction({ value }: { value: unknown }) {
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
          <LogDetailsCard log={log} onClose={() => setVisible(false)} />,
          cardRender,
        )}
    </>
  );
}

export function LogDetailsCard({
  log,
  onClose,
}: {
  log: LogEntryFull;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
  }, []);

  const handleClose = () => {
    dialogRef.current?.close();
    document.body.style.overflow = "";
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      handleClose();
    }
  };

  return (
    <>
      {/* NOTE: Se omite regla para permitit el clic por fuera como acción 
		  para cerrar el dialog y mantener el comportamiento de accesibilidad 
		  del elemento 
	  */}
      {/* eslint-disable-next-line 
		  jsx-a11y/no-noninteractive-element-interactions, 
		  jsx-a11y/click-events-have-key-events 
	  */}
      <dialog
        ref={dialogRef}
        onClose={onClose}
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: 0,
          maxWidth: "600px",
          width: "90%",
          padding: "20px",
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2>Detalles del Log ID: {log.id}</h2>
        <p>Tipo: {log.type}</p>
        <p>Mensaje: {log.shortMessage}</p>
        <button ref={closeButtonRef} onClick={handleClose}>
          Cerrar
        </button>
      </dialog>
    </>
  );
}
