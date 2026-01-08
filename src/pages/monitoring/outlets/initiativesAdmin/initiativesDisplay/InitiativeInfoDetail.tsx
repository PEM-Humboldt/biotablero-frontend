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
import { ErrorsList } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";

export function InitiativeInfoDetail({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const [initiativeInfo, setInitiativeInfo] = useState<InitiativeFullInfo>();
  const [edit, setEdit] = useState(false);
  const [cardErrors, setCardErrors] = useState<string[]>([]);

  useEffect(() => {
    const getInitiativeInfo = async () => {
      const info = await getInitiative(initiativeId);
      setInitiativeInfo(info);
    };

    void getInitiativeInfo();
  }, [initiativeId]);

  const handleDisableInitiative = async () => {
    if (initiativeInfo === undefined) {
      return;
    }

    const endpoint = initiativeInfo.enabled ? "Disable" : "Enable";
    const method = initiativeInfo.enabled ? "delete" : "post";
    const res = await monitoringAPI<InitiativeFullInfo>({
      type: method,
      endpoint: `Initiative/${endpoint}/${initiativeId}`,
    });

    if (isMonitoringAPIError(res)) {
      const { status, message } = res;
      setCardErrors((oldErr) => [
        ...oldErr,
        commonErrorMessage[status] ?? message,
      ]);
      console.error(res);
      return;
    }

    void setInitiativeInfo(res);
  };

  return initiativeInfo === undefined ? (
    <div>No fue posible cargar la información, intenta de nuevo más tarde.</div>
  ) : (
    <div
      className={cn(
        "p-4 mt-1 mb-2 rounded-lg",
        edit ? "outline outline-accent bg-white" : "",
      )}
      data-enabled={initiativeInfo.enabled}
    >
      <div className="flex justify-end gap-2">
        {cardErrors.length > 0 && (
          <ErrorsList
            errId="card_errors"
            errorItems={cardErrors}
            className="flex items-center"
          />
        )}

        {initiativeInfo.enabled && (
          <EditModeTrigger state={edit} setState={setEdit} />
        )}

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
