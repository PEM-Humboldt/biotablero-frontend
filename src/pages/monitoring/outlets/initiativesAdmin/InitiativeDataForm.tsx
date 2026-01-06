import { useCallback, useRef, useState } from "react";

import { Button } from "@ui/shadCN/component/button";

import type {
  InitiativeDataForm,
  InitiativeDataFormErr,
  InitiativeToUpadate,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  isMonitoringAPIError,
  monitoringAPI,
  uploadImages,
} from "pages/monitoring/api/monitoringAPI";
import {
  LocationInput,
  LocationDisplay,
} from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeLocations";
import {
  UsersInfoInput,
  UsersInfoDisplay,
} from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeUsers";
import {
  ContactInfoDisplay,
  ContactInfoInput,
} from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeContact";
import { InitiativeGeneralInfo } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeGeneralInfo";
import { FormListManager } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/FormListManager";
import { validateFormClient } from "pages/monitoring/outlets/initiativesAdmin/utils/validateFormClient";
import { formClientValidations } from "pages/monitoring/outlets/initiativesAdmin/utils/formClientValidations";
import { FormImagesInfo } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeImages";
import {
  getInitialInfo,
  setFormField,
} from "pages/monitoring/outlets/initiativesAdmin/utils/formObjectUpdate";

export function InitiativeDataForm({
  dataToUpdate,
}: {
  dataToUpdate?: InitiativeToUpadate;
}) {
  const [formID, setformID] = useState(0);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});
  const initiative = useRef<InitiativeDataForm>(getInitialInfo(dataToUpdate));

  const handleFormUpdate = useCallback(
    <K extends keyof InitiativeDataForm>(key: K) =>
      setFormField(initiative, key),
    [],
  );

  const handleFormReset = () => {
    initiative.current = getInitialInfo(dataToUpdate);
    setformID((prev) => prev + 1);
    setErrors({});
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentErrors = validateFormClient(
      initiative.current,
      formClientValidations,
    );
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    try {
      const { general, images, ...rest } = { ...initiative.current };
      const payload = { ...general, ...rest };

      const res = await monitoringAPI<InitiativeToUpadate>({
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
        setErrors((oldErr) => ({ ...oldErr, root: [res.message] }));
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
    } catch (err) {
      console.error("Error al crear la iniciativa, intenta más tarde", err);
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
        <InitiativeGeneralInfo
          title="Información general"
          sectionInfo={initiative.current.general}
          sectionUpdater={handleFormUpdate("general")}
          validationErrorsObj={errors?.general ?? {}}
        />

        <FormListManager
          title="Ubicación de la iniciativa"
          maxItems={3}
          sectionInfo={initiative.current.locations}
          sectionUpdater={handleFormUpdate("locations")}
          AddItemComponent={LocationInput}
          CurrentItemsComponent={LocationDisplay}
          validationErrors={errors?.locations ?? []}
        />

        <div className="flex flex-col md:flex-row gap-2 items-start *:w-full">
          <FormListManager
            title="Información de contacto"
            maxItems={5}
            sectionInfo={initiative.current.contacts}
            sectionUpdater={handleFormUpdate("contacts")}
            AddItemComponent={ContactInfoInput}
            CurrentItemsComponent={ContactInfoDisplay}
            validationErrors={errors?.contacts ?? []}
          />

          <FormListManager
            title="líderezas y líderes de la iniciativa"
            maxItems={3}
            sectionInfo={initiative.current.users}
            sectionUpdater={handleFormUpdate("users")}
            AddItemComponent={UsersInfoInput}
            CurrentItemsComponent={UsersInfoDisplay}
            validationErrors={errors?.users ?? []}
          />
        </div>

        <FormImagesInfo
          title="Imágenes (Opcional)"
          sectionInfo={initiative.current.images}
          sectionUpdater={handleFormUpdate("images")}
          validationErrorsObj={errors?.images ?? {}}
        />

        <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
          <Button>Crear iniciativa</Button>
          <Button type="reset" variant="outline_destructive">
            Reiniciar el formulario
          </Button>
        </div>
      </form>
    </div>
  );
}
