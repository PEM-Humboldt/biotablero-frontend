import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { Button } from "@ui/shadCN/component/button";

export function MonitoringResources() {
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const { resourceId } = useParams();

  const userLinkedInitiatives = useMemo(
    () => [
      ...(userInitiativesAs[RoleInInitiative.LEADER] ?? []),
      ...(userInitiativesAs[RoleInInitiative.USER] ?? []),
    ],
    [userInitiativesAs],
  );

  return (
    <div>
      {userLinkedInitiatives.length > 0 && (
        <Button asChild>
          <Link to="/Monitoreo/Recursos/Admin">Administrar mis recursos</Link>
        </Button>
      )}

      {resourceId && <div>el resource id es {resourceId}</div>}
    </div>
  );
}
