import {
  useCallback,
  useEffect,
  createContext,
  useState,
  useMemo,
} from "react";

import { cn } from "@ui/shadCN/lib/utils";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";
import {
  INITIATIVE_CONTACTS_MAX_AMOUNT,
  INITIATIVE_CONTACTS_MIN_AMOUNT,
  INITIATIVE_LEADERS_MAX_AMOUNT,
  INITIATIVE_LEADERS_MIN_AMOUNT,
  INITIATIVE_LOCATIONS_MAX_AMOUNT,
  INITIATIVE_LOCATIONS_MIN_AMOUNT,
} from "@config/monitoring";

import type { User } from "pages/monitoring/types/monitoring";
import type {
  CardInfoGrouped,
  InitiativeContact,
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
  InitiativeFullInfo,
  LocationObj,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  getInitiative,
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { InitiativeStatusDialog } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/InitiativeStatusDialog";
import { FormListUpdater } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/FormListUpdater";
import { LocationInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/LocationInput";
import { makeLocationObj } from "pages/monitoring/outlets/initiativesAdmin/utils/builders";
import { UsersInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/UsersInput";
import { ContactInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/ContactInput";

export type InitiativeCtxType = {
  initiative: CardInfoGrouped | null;
  updater: null | (() => Promise<void>);
};
export const InitiativeCtx = createContext<InitiativeCtxType>({
  initiative: null,
  updater: null,
});

export function InitiativeCard({
  initiative,
  updater,
}: {
  initiative: InitiativeDisplayInfoShort | InitiativeDisplayInfo;
  updater: (value: InitiativeFullInfo) => void;
}) {
  const [cardInfo, setCardInfo] = useState<InitiativeFullInfo | null>(null);
  const [edit, setEdit] = useState(false);
  const [cardErrors, setCardErrors] = useState<string[]>([]);

  const getCardInfo = useCallback(async () => {
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
        "No es posible obtener los detalles de la iniciativa, intenta de nuevo más tarde",
      ]);

      return;
    }

    setCardInfo(info);
    updater(info);
  }, [initiative.id, updater]);

  useEffect(() => {
    void getCardInfo();
  }, [getCardInfo]);

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

  const cardInfoGrouped = useMemo<CardInfoGrouped | null>(() => {
    if (!cardInfo) {
      return null;
    }
    const { locations, users, contacts, ...rest } = cardInfo;
    const { imageUrl, bannerUrl, ...general } = rest;
    return {
      id: general.id,
      general,
      locations,
      contacts,
      users,
      images: { imageUrl, bannerUrl },
    };
  }, [cardInfo]);

  return !cardInfoGrouped ? (
    <div>No fue posible cargar la información, intenta de nuevo más tarde.</div>
  ) : (
    <InitiativeCtx.Provider
      value={{ initiative: cardInfoGrouped, updater: getCardInfo }}
    >
      <div
        className={cn(
          "p-4 mt-1 mb-2 rounded-lg",
          edit ? "outline outline-accent bg-white" : "",
        )}
      >
        <article className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2 px-2 ">
            <h3 className="text-5xl font-normal flex-1 mb-0! text-primary">
              {initiative.name}
            </h3>
            {cardErrors.length > 0 && (
              <ErrorsList
                errId="card_errors"
                errorItems={cardErrors}
                className="flex items-center"
              />
            )}

            <InitiativeStatusDialog
              active={initiative.enabled}
              name={initiative.name}
              handler={() => void handleDisableInitiative()}
            />
          </div>

          <FormListUpdater
            title="Ubicación"
            listName="locations"
            AddItemComponent={LocationInput}
            maxItems={INITIATIVE_LOCATIONS_MAX_AMOUNT}
            minItems={INITIATIVE_LOCATIONS_MIN_AMOUNT}
            renderCols={
              new Map<string, keyof LocationObj>([
                ["Departamento", "department"],
                ["Municipio", "municipality"],
                ["Vereda", "locality"],
              ])
            }
            renderRowsCallback={makeLocationObj}
            backEndpoint="InitiativeLocation"
            isEditable={initiative.enabled}
          />

          <div className="flex flex-col md:flex-row gap-2 items-start *:w-full">
            <FormListUpdater
              title="Información de contacto"
              listName="contacts"
              AddItemComponent={ContactInput}
              maxItems={INITIATIVE_CONTACTS_MAX_AMOUNT}
              minItems={INITIATIVE_CONTACTS_MIN_AMOUNT}
              renderCols={
                new Map<string, keyof InitiativeContact>([
                  ["correo", "email"],
                  ["tele", "phone"],
                ])
              }
              backEndpoint="InitiativeContact"
              isEditable={initiative.enabled}
            />

            <FormListUpdater
              title="Lideres y liderezas"
              listName="users"
              AddItemComponent={UsersInput}
              maxItems={INITIATIVE_LEADERS_MAX_AMOUNT}
              minItems={INITIATIVE_LEADERS_MIN_AMOUNT}
              renderCols={
                new Map<string, keyof User>([["Nombre de usuario", "userName"]])
              }
              backEndpoint="InitiativeUser"
              isEditable={initiative.enabled}
            />
          </div>
        </article>
      </div>
    </InitiativeCtx.Provider>
  );
}
