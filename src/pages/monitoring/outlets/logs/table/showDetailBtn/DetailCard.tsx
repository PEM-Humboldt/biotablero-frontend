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
