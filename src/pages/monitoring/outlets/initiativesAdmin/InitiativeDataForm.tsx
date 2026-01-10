import { type FormEvent, useCallback, useRef, useState } from "react";

import { Button } from "@ui/shadCN/component/button";

import type {
  InitiativeDataForm,
  InitiativeDataFormErr,
  InitiativeFullInfo,
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
import { ErrorsList } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";

// TODO: Cargar solo las imagenes cuando solo falla ese pedazo y se creo la Ini
export function InitiativeDataForm({
  dataToUpdate,
}: {
  dataToUpdate?: InitiativeFullInfo;
}) {
  const [formID, setformID] = useState(0);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});
  const [isPending, setIsPending] = useState(false);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const currentErrors = validateFormClient(
      initiative.current,
      formClientValidations,
    );
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setIsPending(false);
      return;
    }

    try {
      const { general, images, ...rest } = { ...initiative.current };
      const payload = { ...general, ...rest };

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
        const { status, message } = res;

        setErrors((oldErr) => ({
          ...oldErr,
          root: [commonErrorMessage[status] ?? message],
        }));
        setIsPending(false);
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
      setErrors((oldErr) => ({ ...oldErr, root: ["Error interno de la app"] }));
      console.error("Critical error:", err);
    } finally {
      setIsPending(false);
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
          title="Imágenes"
          sectionInfo={initiative.current.images}
          sectionUpdater={handleFormUpdate("images")}
          validationErrorsObj={errors?.images ?? {}}
        />

        <ErrorsList
          errorItems={errors.root ?? []}
          className="bg-red-50 p-6 mt-4 rounded-lg md:w-[50%] outline-2 outline-accent self-end"
        />

        <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
          <Button disabled={isPending}>
            {isPending ? "Creando iniciativa..." : "Crear iniciativa"}
          </Button>
          <Button
            type="reset"
            variant="outline_destructive"
            disabled={isPending}
          >
            Reiniciar el formulario
          </Button>
        </div>
      </form>
    </div>
  );
}
