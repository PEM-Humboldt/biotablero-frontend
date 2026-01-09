import { useEffect, useMemo, useState } from "react";

import { cn } from "@ui/shadCN/lib/utils";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";

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
import { groupInitiativeInfo } from "pages/monitoring/outlets/initiativesAdmin/utils/formObjectUpdate";
import {
  DisplayContacts,
  DisplayGeneral,
  DisplayImages,
  DisplayLocations,
  DisplayUsers,
  InitiativeSection,
} from "pages/monitoring/outlets/initiativesAdmin/initiativesDisplay/initiativeInfoDetail/InitiativeSection";

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
          "No es posible obtener la información completa, intente de nuevo más tarde",
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

    setEdit(false);
    void updater(res);
  };

  const groupedInfo = useMemo(
    () => groupInitiativeInfo(initiative),
    [initiative],
  );

  return initiative === undefined || !groupedInfo ? (
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

      <article>
        <InitiativeSection
          edit={edit}
          title="Información general"
          group="general"
          info={groupedInfo}
          DisplayInfo={DisplayGeneral}
        />

        <InitiativeSection
          edit={edit}
          title="Ubicación de la iniciativa"
          group="locations"
          info={groupedInfo}
          DisplayInfo={DisplayLocations}
        />

        <InitiativeSection
          edit={edit}
          title="Cómo contactarse con la iniciativa"
          group="contacts"
          info={groupedInfo}
          DisplayInfo={DisplayContacts}
        />

        <InitiativeSection
          edit={edit}
          title="Lideres y liderezas de la iniciativa"
          group="users"
          info={groupedInfo}
          DisplayInfo={DisplayUsers}
        />

        <InitiativeSection
          edit={edit}
          title="Imégenes de la iniciativa"
          group="images"
          info={groupedInfo}
          DisplayInfo={DisplayImages}
        />
      </article>
    </div>
  );
}
