import React from "react";
import Modal from "@mui/material/Modal";

interface ConfirmationModalTypes {
  open?: boolean;
  onClose?: () => void;
  message: string;
  styleCustom?: string | null;
  onContinue: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  open = false,
  onClose = () => {},
  message,
  onContinue,
  onCancel,
  styleCustom = null,
}: ConfirmationModalTypes) {
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={onClose}
    >
      <div className={styleCustom || "newBiomeAlarm"}>
        <div>{message}</div>
        <button type="button" onClick={onContinue}>
          Si
        </button>
        <button type="button" onClick={onCancel}>
          No
        </button>
      </div>
    </Modal>
  );
}
