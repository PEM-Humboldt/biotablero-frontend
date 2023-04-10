import WarningIcon from "@mui/icons-material/Warning";
import PendingIcon from "@mui/icons-material/Pending";

const selectorMessage = (type: string) => () => {
  if (type === "loading") {
    return (
      <div style={{ display: "flex" }}>
        <PendingIcon style={{ color: "#e84a5f" }} />
        <span style={{ paddingLeft: 10, alignSelf: "center" }}>
          Cargando información...
        </span>
      </div>
    );
  }

  if (type === "conn-error") {
    return (
      <div style={{ display: "flex" }}>
        <WarningIcon style={{ color: "#e84a5f" }} />
        <span style={{ paddingLeft: 10, alignSelf: "center" }}>
          Hubo un error en esta funcionalidad, prueba otra alternativa.
        </span>
      </div>
    );
  }

  return <div></div>;
};

export default selectorMessage;
