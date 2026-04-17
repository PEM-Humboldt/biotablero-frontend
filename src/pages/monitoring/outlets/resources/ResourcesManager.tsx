import { Button } from "@ui/shadCN/component/button";
import { Link } from "react-router";

export function ResourcesManager() {
  return (
    <div>
      Manager de recursos
      <Button asChild>
        <Link to="/Monitoreo/Recursos">Cerrar el editor</Link>
      </Button>
    </div>
  );
}
