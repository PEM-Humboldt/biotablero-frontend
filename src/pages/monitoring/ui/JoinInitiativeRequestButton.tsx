import { RoleInInitiative } from "@appTypes/user";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { Button } from "@ui/shadCN/component/button";
import { useInitiativeCTX } from "../hooks/useInitiativeCTX";

export function JoinInitiativeRequestButton() {
  const { userRoleByInitiativeId } = useUserInMonitoringCTX();
  const { initiativeId } = useInitiativeCTX();

  // TODO: Obtener las solicitudes de esta pag
  // Crear juego de estados
  // - si es lider, no mostrar
  // - si es participante, opcion eliminar,
  // - si es solicitante opcion de cancelar,
  // - si no es naiden, mandar a logeo,
  // - si es usuario solicitar
  // conectar accion con las api correspondiente
  // montar modal

  console.log(initiativeId);
  switch (userRoleByInitiativeId[initiativeId ?? 0]) {
    case RoleInInitiative.LEADER:
      return <Button>Lider</Button>;
    case RoleInInitiative.USER:
      return <Button>Participante</Button>;
    case RoleInInitiative.VIEWER:
      return <Button>sapo</Button>;
    default:
      return <Button>don nadie</Button>;
  }
}
