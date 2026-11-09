import { Button } from "@ui/shadCN/component/button";

import {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
} from "pages/monitoring/types/initiative";

export function MonitoringEventsEditor({
  initiative,
}: {
  initiative: InitiativeDisplayInfoShort | InitiativeDisplayInfo;
}) {
  return (
    <Button variant="outline" disabled={!initiative.enabled}>
      Eventos de monitoreo
    </Button>
  );
}
