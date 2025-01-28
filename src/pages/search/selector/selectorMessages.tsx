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

export const ErrorMessage = () => (
  <div style={{ display: "flex" }}>
    <WarningIcon style={{ color: "#e84a5f" }} />
    <span style={{ paddingLeft: 10, alignSelf: "center" }}>
      Hubo un error en esta funcionalidad, prueba otra alternativa.
    </span>
  </div>
);
