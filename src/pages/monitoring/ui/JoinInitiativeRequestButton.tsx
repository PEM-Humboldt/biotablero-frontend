import { RoleInInitiative } from "@appTypes/user";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiatives";
import { Button } from "@ui/shadCN/component/button";

export function JoinInitiativeRequestButton({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const { userRoleByInitiativeId } = useUserInMonitoringCTX();

  // TODO: Obtener las solicitudes de esta pag
  // Crear juego de estados
  // - si es lider, no mostrar
  // - si es participante, opcion eliminar,
  // - si es solicitante opcion de cancelar,
  // - si no es naiden, mandar a logeo,
  // - si es usuario solicitar
  // conectar accion con las api correspondiente
  // montar modal

  switch (userRoleByInitiativeId[initiativeId]) {
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
