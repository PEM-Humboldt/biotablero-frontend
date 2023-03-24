import WarningIcon from "@mui/icons-material/Warning";

const connErrorMessage = () => (
  <div style={{ display: "flex" }}>
    <WarningIcon style={{ color: "#e84a5f" }} />
    <span style={{ paddingLeft: 10, alignSelf: "center" }}>
      Hubo un error en esta funcionalidad, prueba otra alternativa.
    </span>
  </div>
);

export default connErrorMessage;
