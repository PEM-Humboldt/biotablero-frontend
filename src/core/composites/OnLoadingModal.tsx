import { Modal } from "@mui/material";

export function OnLoadingModal({ open }: { open: boolean }) {
  return (
    <Modal open={open} disableAutoFocus sx={{ position: "absolute" }}>
      <div className="generalAlarm">
        <h2>
          <b>Cargando</b>
          <div className="load-wrapp">
            <div className="load-1">
              <div className="line" />
              <div className="line" />
              <div className="line" />
            </div>
          </div>
        </h2>
      </div>
    </Modal>
  );
}
