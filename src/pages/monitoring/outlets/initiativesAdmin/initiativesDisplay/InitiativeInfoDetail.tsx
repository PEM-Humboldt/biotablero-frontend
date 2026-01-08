import { useCallback, useEffect, useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";

import type { InitiativeFullInfo } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  getInitiative,
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { EnabledInitiativeStatusDialog } from "pages/monitoring/outlets/initiativesAdmin/initiativesDisplay/initiativeInfoDetail/DisableInitiativeDialog";
import { EditModeTrigger } from "pages/monitoring/outlets/initiativesAdmin/initiativesDisplay/initiativeInfoDetail/EditModeTrigger";

export function InitiativeInfoDetail({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const [initiativeInfo, setInitiativeInfo] = useState<InitiativeFullInfo>();
  const [edit, setEdit] = useState(false);

  const getInitiativeInfo = useCallback(async () => {
    const info = await getInitiative(initiativeId);
    setInitiativeInfo(info);
  }, [initiativeId]);

  useEffect(() => {
    void getInitiativeInfo();
  }, [getInitiativeInfo]);

  const handleDisableInitiative = async () => {
    if (initiativeInfo === undefined) {
      return;
    }

    const endpoint = initiativeInfo.enabled ? "Disable" : "Enable";
    const method = initiativeInfo.enabled ? "delete" : "post";
    const res = await monitoringAPI({
      type: method,
      endpoint: `Initiative/${endpoint}/${initiativeId}`,
    });

    if (isMonitoringAPIError(res)) {
      console.error("pailas");
    }

    void getInitiativeInfo();
  };

  return initiativeInfo === undefined ? (
    <div>No fue posible cargar la información, intenta de nuevo más tarde.</div>
  ) : (
    <div
      className={cn(
        "p-4 mt-1 mb-2 rounded-lg",
        edit ? "outline outline-accent bg-white" : "",
      )}
    >
      <div className="flex justify-end gap-2">
        <EditModeTrigger state={edit} setState={setEdit} />
        <EnabledInitiativeStatusDialog
          active={initiativeInfo.enabled}
          name={initiativeInfo.name}
          handler={() => void handleDisableInitiative()}
        />
      </div>
      <h4>{initiativeId}</h4>
    </div>
  );
}
