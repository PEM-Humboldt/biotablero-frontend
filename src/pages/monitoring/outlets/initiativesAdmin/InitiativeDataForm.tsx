import { type FormEvent, useCallback, useRef, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  INITIATIVE_CONTACTS_MAX_AMOUNT,
  INITIATIVE_LOCATIONS_MAX_AMOUNT,
  INITIATIVE_LEADERS_MAX_AMOUNT,
} from "@config/monitoring";

import type { UserItem } from "pages/monitoring/types/catalog";
import { createInitiative } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  isTagInInitiative,
  type InitiativeContact,
  type LocationObj,
} from "pages/monitoring/types/initiative";
import type {
  InitiativeDataForm,
  InitiativeDataFormErr,
} from "pages/monitoring/types/initiativeData";
import { uploadImages } from "pages/monitoring/api/services/assets";
import { validateFormClient } from "pages/monitoring/ui/initiativesAdmin/utils/validateFormClient";
import { newInitiativeValidations } from "pages/monitoring/ui/initiativesAdmin/utils/formClientValidations";
import { GeneralInfoInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/GeneralInfo";
import { FormListManager } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/FormListManager";
import { LocationInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/LocationInput";
import { ContactInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/ContactInput";
import { UsersInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/UsersInput";
import { TagsManager } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/TagsManager";
import { ImagesInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/ImagesInput";
import {
  makeInitialInfo,
  setFormField,
} from "pages/monitoring/ui/initiativesAdmin/utils/formObjectUpdate";
import { fetchAndMakeLocationObj } from "pages/monitoring/ui/initiativesAdmin/utils/builders";
import { uiText as componentText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { uiText } from "pages/monitoring/outlets/initiativesAdmin/layout/uiText";
import { addTagToInitiative } from "pages/monitoring/api/services/tags";

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

    const { general, images, tags, ...rest } = { ...initiative.current };

    const cleanGeneral = Object.fromEntries(
      Object.entries(general).filter(([_, value]) => Boolean(value)),
    ) as Record<string, string>;

    const payload = { ...cleanGeneral, ...rest };

    const res = await createInitiative(payload);

    if (isMonitoringAPIError(res)) {
      setErrors((oldErr) => ({
        ...oldErr,
        root: res.data.map((error) => error.msg),
      }));

      setIsLoading(false);
      return;
    }

    const tagsToAdd = tags.map((tag) =>
      addTagToInitiative(res.id, isTagInInitiative(tag) ? tag.tag.id : tag.id),
    );
    const tagsAdded = await Promise.all(tagsToAdd);
    tagsAdded.forEach((tag) => {
      if (isMonitoringAPIError(tag)) {
        setErrors((oldErr) => ({
          ...oldErr,
          tags: [...(oldErr.tags ?? []), ...tag.data.map((t) => t.msg)],
        }));
      }
    });

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

      setIsLoading(false);
    }

    onSuccess();
    setIsLoading(false);
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
          title={componentText.initiative.module.general.title}
          sectionInfo={initiative.current.general}
          sectionUpdater={handleFormUpdate("general")}
          validationErrorsObj={errors?.general ?? {}}
        />

        <FormListManager
          title={componentText.initiative.module.locations.title}
          initiativeSection={initiative.current.locations}
          AddItemComponent={LocationInput}
          maxItems={INITIATIVE_LOCATIONS_MAX_AMOUNT}
          renderCols={
            new Map<string, keyof LocationObj>([
              [
                componentText.initiative.module.locations.tableCol[0],
                "department",
              ],
              [
                componentText.initiative.module.locations.tableCol[1],
                "municipality",
              ],
              [
                componentText.initiative.module.locations.tableCol[2],
                "locality",
              ],
            ])
          }
          renderRowCallback={fetchAndMakeLocationObj}
          sectionUpdater={handleFormUpdate("locations")}
          validationErrors={errors?.locations ?? []}
        />

        <div className="flex flex-col md:flex-row gap-2 items-start *:w-full">
          <FormListManager
            title={componentText.initiative.module.contacts.title}
            initiativeSection={initiative.current.contacts}
            AddItemComponent={ContactInput}
            maxItems={INITIATIVE_CONTACTS_MAX_AMOUNT}
            renderCols={
              new Map<string, keyof InitiativeContact>([
                [componentText.initiative.module.contacts.tableCol[0], "email"],
                [componentText.initiative.module.contacts.tableCol[1], "phone"],
              ])
            }
            sectionUpdater={handleFormUpdate("contacts")}
            validationErrors={errors?.contacts ?? []}
          />

          <FormListManager
            title={componentText.initiative.module.users.title}
            initiativeSection={initiative.current.users}
            AddItemComponent={UsersInput}
            maxItems={INITIATIVE_LEADERS_MAX_AMOUNT}
            renderCols={
              new Map<string, keyof UserItem>([
                [
                  componentText.initiative.module.contacts.tableCol[0],
                  "userName",
                ],
              ])
            }
            sectionUpdater={handleFormUpdate("users")}
            validationErrors={errors?.users ?? []}
          />
        </div>

        <TagsManager
          title={componentText.initiative.module.tags.title}
          sectionInfo={initiative.current.tags}
          sectionUpdater={handleFormUpdate("tags")}
          validationErrors={errors?.tags ?? []}
          initiativeId={null}
        />

        <ImagesInput
          title={componentText.initiative.module.images.title}
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
