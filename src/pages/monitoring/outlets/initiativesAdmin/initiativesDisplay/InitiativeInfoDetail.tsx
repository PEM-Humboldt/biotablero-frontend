import { useEffect, useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";

import type {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
  InitiativeFullInfo,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
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
  initiative,
  updater,
}: {
  initiative: InitiativeDisplayInfoShort | InitiativeDisplayInfo;
  updater: (value: InitiativeFullInfo) => void;
}) {
  const [edit, setEdit] = useState(false);
  const [cardErrors, setCardErrors] = useState<string[]>([]);

  useEffect(() => {
    const getInitiativeInfo = async () => {
      const info = await getInitiative(initiative.id);

      if (isMonitoringAPIError(info)) {
        const { status, message } = info;
        setCardErrors((oldErr) => [
          ...oldErr,
          commonErrorMessage[status] ?? message,
        ]);
        console.error(info);
        return;
      }

      if (info === undefined) {
        setCardErrors((oldErr) => [
          ...oldErr,
          "No es posible actualizar la información, intente de nuevo más tarde",
        ]);

        return;
      }

      updater(info);
    };

    void getInitiativeInfo();
  }, [initiative.id, updater]);

  const handleDisableInitiative = async () => {
    if (!initiative) {
      return;
    }

    const endpoint = initiative.enabled ? "Disable" : "Enable";
    const method = initiative.enabled ? "delete" : "post";
    const res = await monitoringAPI<InitiativeFullInfo>({
      type: method,
      endpoint: `Initiative/${endpoint}/${initiative.id}`,
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

    void updater(res);
  };

  return initiative === undefined ? (
    <div>No fue posible cargar la información, intenta de nuevo más tarde.</div>
  ) : (
    <div
      className={cn(
        "p-4 mt-1 mb-2 rounded-lg",
        edit ? "outline outline-accent bg-white" : "",
      )}
      data-enabled={initiative.enabled}
    >
      <div className="flex justify-end gap-2">
        {cardErrors.length > 0 && (
          <ErrorsList
            errId="card_errors"
            errorItems={cardErrors}
            className="flex items-center"
          />
        )}

        {initiative.enabled && (
          <EditModeTrigger state={edit} setState={setEdit} />
        )}

        <EnabledInitiativeStatusDialog
          active={initiative.enabled}
          name={initiative.name}
          handler={() => void handleDisableInitiative()}
        />
      </div>
      <h4>{initiative.id}</h4>
    </div>
  );
}
