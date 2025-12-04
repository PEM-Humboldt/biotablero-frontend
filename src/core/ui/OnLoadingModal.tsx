import { Modal } from "@mui/material";

export function OnLoadingModal({
  open,
  containerID,
}: {
  open: boolean;
  containerID?: string;
}) {
  const containerElement = () =>
    containerID ? document.getElementById(containerID) : document.body;

  return (
    <Modal
      open={open}
      disableAutoFocus
      sx={{ position: "absolute" }}
      container={containerElement}
    >
      <div className="loading-backdrop">
        <div className="loading-wrapper">
          <h2>Cargando</h2>
          <div className="loading-bars">
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
