import { type FormEvent, useCallback, useRef, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";
import {
  INITIATIVE_CONTACTS_MAX_AMOUNT,
  INITIATIVE_LOCATIONS_MAX_AMOUNT,
  INITIATIVE_LEADERS_MAX_AMOUNT,
} from "@config/monitoring";

import { uiText } from "pages/monitoring/outlets/initiativesAdmin/layout/uiText";
import type { UserItem } from "pages/monitoring/types/catalog";
import type {
  InitiativeContact,
  InitiativeFullInfo,
  LocationObj,
} from "pages/monitoring/types/initiative";
import type {
  InitiativeDataForm,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  isMonitoringAPIError,
  monitoringAPI,
  uploadImages,
} from "pages/monitoring/api/monitoringAPI";
import { GeneralInfoInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/GeneralInfo";
import { FormListManager } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/FormListManager";
import { LocationInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/LocationInput";
import { ContactInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/ContactInput";
import { UsersInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/UsersInput";
import { validateFormClient } from "pages/monitoring/outlets/initiativesAdmin/utils/validateFormClient";
import { newInitiativeValidations } from "pages/monitoring/outlets/initiativesAdmin/utils/formClientValidations";
import { ImagesInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/ImagesInput";
import {
  makeInitialInfo,
  setFormField,
} from "pages/monitoring/outlets/initiativesAdmin/utils/formObjectUpdate";
import { fetchAndMakeLocationObj } from "pages/monitoring/outlets/initiativesAdmin/utils/builders";

export function InitiativeDataForm({ onSuccess }: { onSuccess: () => void }) {
  const [formID, setformID] = useState(0);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});
  const [isLoading, setIsLoading] = useState(false);
  const initiative = useRef<InitiativeDataForm>(makeInitialInfo());

  const handleFormUpdate = useCallback(
    <K extends keyof InitiativeDataForm>(key: K) =>
      setFormField(initiative, key),
    [],
  );

  const handleFormReset = () => {
    initiative.current = makeInitialInfo();
    setformID((prev) => prev + 1);
    setErrors({});
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const currentErrors = validateFormClient(
      initiative.current,
      newInitiativeValidations,
    );
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const { general, images, ...rest } = { ...initiative.current };

      const cleanGeneral = Object.fromEntries(
        Object.entries(general).filter(([_, value]) => Boolean(value)),
      ) as Record<string, string>;

      const payload = { ...cleanGeneral, ...rest };

      const res = await monitoringAPI<InitiativeFullInfo>({
        type: "put",
        endpoint: "initiative",
        options: {
          data: payload,
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      });

      if (isMonitoringAPIError(res)) {
        const { status, message, data } = res;
        setErrors((oldErr) => ({
          ...oldErr,
          root: [
            `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
          ],
        }));
        console.error(res);

        return;
      }

      const imagesToUpload = [
        { file: images.imageUrl, path: `initiative/UploadImage/${res.id}` },
        { file: images.bannerUrl, path: `initiative/UploadBanner/${res.id}` },
      ];

      const imageUploadErrors = await uploadImages(imagesToUpload);

      if (imageUploadErrors?.length > 0) {
        setErrors((oldErr) => ({
          ...oldErr,
          images: { root: imageUploadErrors },
        }));
      }

      onSuccess();
    } catch (err) {
      setErrors((oldErr) => ({ ...oldErr, root: [uiText.criticalError.user] }));
      console.error(uiText.criticalError.log, err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden">
      <h4 className="px-6 py-2 mb-0 text-base bg-primary text-primary-foreground">
        Nueva iniciativa
      </h4>

      <form
        action=""
        key={formID}
        onReset={handleFormReset}
        onSubmit={(e) => void handleSubmit(e)}
        className="flex flex-col gap-2 p-6"
      >
        <GeneralInfoInput
          title={uiText.initiative.module.general.title}
          sectionInfo={initiative.current.general}
          sectionUpdater={handleFormUpdate("general")}
          validationErrorsObj={errors?.general ?? {}}
        />

        <FormListManager
          title={uiText.initiative.module.locations.title}
          initiativeSection={initiative.current.locations}
          AddItemComponent={LocationInput}
          maxItems={INITIATIVE_LOCATIONS_MAX_AMOUNT}
          renderCols={
            new Map<string, keyof LocationObj>([
              [uiText.initiative.module.locations.tableCol[0], "department"],
              [uiText.initiative.module.locations.tableCol[1], "municipality"],
              [uiText.initiative.module.locations.tableCol[2], "locality"],
            ])
          }
          renderRowCallback={fetchAndMakeLocationObj}
          sectionUpdater={handleFormUpdate("locations")}
          validationErrors={errors?.locations ?? []}
        />

        <div className="flex flex-col md:flex-row gap-2 items-start *:w-full">
          <FormListManager
            title={uiText.initiative.module.contacts.title}
            initiativeSection={initiative.current.contacts}
            AddItemComponent={ContactInput}
            maxItems={INITIATIVE_CONTACTS_MAX_AMOUNT}
            renderCols={
              new Map<string, keyof InitiativeContact>([
                [uiText.initiative.module.contacts.tableCol[0], "email"],
                [uiText.initiative.module.contacts.tableCol[1], "phone"],
              ])
            }
            sectionUpdater={handleFormUpdate("contacts")}
            validationErrors={errors?.contacts ?? []}
          />

          <FormListManager
            title={uiText.initiative.module.users.title}
            initiativeSection={initiative.current.users}
            AddItemComponent={UsersInput}
            maxItems={INITIATIVE_LEADERS_MAX_AMOUNT}
            renderCols={
              new Map<string, keyof UserItem>([
                [uiText.initiative.module.contacts.tableCol[0], "userName"],
              ])
            }
            sectionUpdater={handleFormUpdate("users")}
            validationErrors={errors?.users ?? []}
          />
        </div>

        <ImagesInput
          title={uiText.initiative.module.images.title}
          sectionInfo={initiative.current.images}
          sectionUpdater={handleFormUpdate("images")}
          validationErrorsObj={errors?.images ?? {}}
        />

        <ErrorsList
          errorItems={errors.root ?? []}
          className="bg-red-50 p-6 mt-4 rounded-lg md:w-[50%] outline-2 outline-accent self-end"
        />

        <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
          <Button disabled={isLoading}>
            {isLoading
              ? uiText.initiative.creatingNew
              : uiText.initiative.createNew}
          </Button>
          <Button
            type="reset"
            variant="outline_destructive"
            disabled={isLoading}
          >
            {uiText.restartForm}
          </Button>
        </div>
      </form>
    </div>
  );
}
