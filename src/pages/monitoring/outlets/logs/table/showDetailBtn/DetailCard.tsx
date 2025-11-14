import { useEffect, useRef } from "react";
import type { LogEntryFull } from "pages/monitoring/types/requestParams";

export function DetailCard({
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

  const logDate = new Date(log.timeStamp);

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
        aria-labelledby={log.id}
      >
        <h3 id={log.id}>Registro del sistema</h3>
        <div>
          <p>
            <span>ID</span>
            <span>{log.id}</span>
          </p>
          <p>
            <span>Fecha y hora</span>
            <span>
              {logDate.toLocaleDateString()} {logDate.toLocaleTimeString()}
            </span>
          </p>
          <p>
            <span>Tipo</span>
            <span>{log.type}</span>
          </p>
          <p>
            <span>Mensaje corto</span>
            <span>{log.shortMessage}</span>
          </p>
          <p>
            <span>Navegador</span>
            <span>{log.clientAgent}</span>
          </p>
          <p>
            <span>Dirección IP</span>
            <span>{log.clientIp}</span>
          </p>
          <p>
            <span>Descripcion</span>
            <span>{log.message}</span>
          </p>
        </div>
        <button ref={closeButtonRef} onClick={handleClose}>
          Cerrar
        </button>
      </dialog>
    </>
  );
}
