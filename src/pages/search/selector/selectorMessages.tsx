import WarningIcon from "@mui/icons-material/Warning";
import PendingIcon from "@mui/icons-material/Pending";

export const LoadingMessage = () => (
  <div style={{ display: "flex" }}>
    <PendingIcon style={{ color: "#e84a5f" }} />
    <span style={{ paddingLeft: 10, alignSelf: "center" }}>
      Cargando información...
    </span>
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <div style={{ display: "flex" }}>
    <WarningIcon style={{ color: "#e84a5f" }} />
    <span style={{ paddingLeft: 10, alignSelf: "center" }}>{message}</span>
  </div>
);
