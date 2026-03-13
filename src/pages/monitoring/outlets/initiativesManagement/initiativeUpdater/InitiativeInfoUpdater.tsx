import { useCallback, useEffect, useState, useMemo } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  INITIATIVE_CONTACTS_MAX_AMOUNT,
  INITIATIVE_CONTACTS_MIN_AMOUNT,
  INITIATIVE_LOCATIONS_MAX_AMOUNT,
  INITIATIVE_LOCATIONS_MIN_AMOUNT,
} from "@config/monitoring";

import { RoleInInitiative } from "pages/monitoring/types/catalog";
import type {
  InitiativeContact,
  InitiativeFullInfo,
  TagDataBasic,
  LocationObj,
} from "pages/monitoring/types/initiative";
import type { CardInfoGrouped } from "pages/monitoring/types/initiativeData";
import {
  getInitiative,
  changeInitiativeStatus,
} from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { makeLocationObj } from "pages/monitoring/ui/initiativesAdmin/utils/builders";
import { InitiativeStatusDialog } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/InitiativeStatusDialog";
import { FormListUpdater } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/FormListUpdater";
import { LocationInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/LocationInput";
import { ContactInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/ContactInput";
import { GeneralInfoUpdater } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/GeneralInfoUpdater";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/initiativeUpdater/layout/uiText";

import { LeaderInitiativeUpdateCtx } from "pages/monitoring/ui/initiativesAdmin/hooks/useAdminUpdateContext";
import { TagInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/TagInput";

export function InitiativeInfoUpdater({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [initiativeInfo, setInitiativeInfo] =
    useState<InitiativeFullInfo | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentEdit, setCurrentEdit] = useState<
    keyof CardInfoGrouped | "none" | null
  >(null);

  useEffect(() => {
    setCurrentEdit(initiativeInfo?.enabled ? "none" : null);
  }, [initiativeInfo?.enabled]);

  const getInitiativeInfo = useCallback(async () => {
    setIsLoading(true);
    const res = await getInitiative(initiativeId);

    if (isMonitoringAPIError(res)) {
      setErrors((oldErr) => [...oldErr, ...res.data.map((error) => error.msg)]);
      setInitiativeInfo(null);
      setIsLoading(false);

      return;
    }

    if (!res) {
      setErrors((oldErr) => [...oldErr, uiText.error.noGetData]);
      setInitiativeInfo(null);
      setIsLoading(false);

      return;
    }

    const initiativeAdminInfo = {
      ...res,
      users: res.users.filter(
        (user) => user.level.id === RoleInInitiative.LEADER,
      ),
    } satisfies InitiativeFullInfo;

    setInitiativeInfo(initiativeAdminInfo);
    setIsLoading(false);
  }, [initiativeId]);

  useEffect(() => {
    void getInitiativeInfo();
  }, [getInitiativeInfo]);

  const handleDisableInitiative = async () => {
    if (!initiativeInfo) {
      return;
    }

    setIsLoading(true);
    const res = await changeInitiativeStatus(
      initiativeInfo.enabled,
      initiativeInfo.id,
    );

    if (isMonitoringAPIError(res)) {
      setErrors((oldErr) => [...oldErr, ...res.data.map((error) => error.msg)]);
      setIsLoading(false);

      return;
    }

    setCurrentEdit(res.enabled ? "none" : null);

    void getInitiativeInfo();
    setIsLoading(false);
  };

  const initiativeInfoGrouped = useMemo<CardInfoGrouped | null>(() => {
    if (!initiativeInfo) {
      return null;
    }
    const { locations, users, contacts, ...rest } = initiativeInfo;
    const { imageUrl, bannerUrl, ...general } = rest;
    return {
      id: general.id,
      general,
      locations,
      contacts,
      users,
      images: { imageUrl, bannerUrl },
      tags: general.tags,
    };
  }, [initiativeInfo]);

  return !initiativeInfoGrouped ? (
    <div className="text-center font-light text-4xl text-primary px-12 py-24">
      {isLoading ? (
        uiText.loading
      ) : (
        <>
          <span className="text-accent">{uiText.error.noGetData}</span>
          <ErrorsList
            errId="card_errors"
            errorItems={errors}
            className="bg-red-50 border border-accent flex flex-col gap-2 items-center w-[50%] mx-auto my-4 p-6 rounded-lg"
          />
        </>
      )}
    </div>
  ) : (
    <LeaderInitiativeUpdateCtx.Provider
      value={{
        initiative: initiativeInfoGrouped,
        updater: getInitiativeInfo,
        currentEdit,
        setCurrentEdit,
      }}
    >
      <article className="flex flex-col gap-2 p-4 mt-1 mb-2 rounded-lg">
        <div className="flex items-baseline gap-2 px-2 ">
          <h3 className="text-5xl font-normal flex-1 mb-0! text-primary">
            {initiativeInfoGrouped.general.name}
          </h3>
          {errors.length > 0 && (
            <ErrorsList
              errId="card_errors"
              errorItems={errors}
              className="flex items-center"
            />
          )}

          <InitiativeStatusDialog
            active={initiativeInfoGrouped.general.enabled}
            name={initiativeInfoGrouped.general.name}
            handler={() => void handleDisableInitiative()}
          />
        </div>

        <GeneralInfoUpdater
          title={uiText.tabsContent.initiativeManagement.general.title}
        />

        <FormListUpdater
          title={uiText.tabsContent.initiativeManagement.locations.title}
          initiativeSection="locations"
          AddItemComponent={LocationInput}
          maxItems={INITIATIVE_LOCATIONS_MAX_AMOUNT}
          minItems={INITIATIVE_LOCATIONS_MIN_AMOUNT}
          renderCols={
            new Map<string, keyof LocationObj>([
              [
                uiText.tabsContent.initiativeManagement.locations.tableCol[0],
                "department",
              ],
              [
                uiText.tabsContent.initiativeManagement.locations.tableCol[1],
                "municipality",
              ],
              [
                uiText.tabsContent.initiativeManagement.locations.tableCol[2],
                "locality",
              ],
            ])
          }
          renderRowsCallback={makeLocationObj}
          backEndpoint="InitiativeLocation"
        />

        <FormListUpdater
          title={uiText.tabsContent.initiativeManagement.contacts.title}
          initiativeSection="contacts"
          AddItemComponent={ContactInput}
          maxItems={INITIATIVE_CONTACTS_MAX_AMOUNT}
          minItems={INITIATIVE_CONTACTS_MIN_AMOUNT}
          renderCols={
            new Map<string, keyof InitiativeContact>([
              [
                uiText.tabsContent.initiativeManagement.contacts.tableCol[0],
                "email",
              ],
              [
                uiText.tabsContent.initiativeManagement.contacts.tableCol[1],
                "phone",
              ],
            ])
          }
          backEndpoint="InitiativeContact"
        />

        <FormListUpdater
          title={uiText.tabsContent.initiativeManagement.tags.title}
          initiativeSection="tags"
          AddItemComponent={TagInput}
          maxItems={Infinity}
          minItems={0}
          renderCols={
            new Map<string, keyof TagDataBasic>([
              [
                uiText.tabsContent.initiativeManagement.tags.tableCol[0],
                "category",
              ],
              [
                uiText.tabsContent.initiativeManagement.tags.tableCol[1],
                "name",
              ],
            ])
          }
          backEndpoint="InitiativeTag"
        />
      </article>
    </LeaderInitiativeUpdateCtx.Provider>
  );
}
