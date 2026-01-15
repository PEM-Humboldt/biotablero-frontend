import { type FormEvent, useCallback, useRef, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";
import {
  INITIATIVE_CONTACTS_MAX_AMOUNT,
  INITIATIVE_LOCATIONS_MAX_AMOUNT,
  INITIATIVE_LEADERS_MAX_AMOUNT,
} from "@config/monitoring";

import type { User } from "pages/monitoring/types/monitoring";
import type {
  InitiativeContact,
  InitiativeDataForm,
  InitiativeDataFormErr,
  InitiativeFullInfo,
  LocationObj,
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
import { formClientValidations } from "pages/monitoring/outlets/initiativesAdmin/utils/formClientValidations";
import { ImagesInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/ImagesInput";
import {
  makeInitialInfo,
  setFormField,
} from "pages/monitoring/outlets/initiativesAdmin/utils/formObjectUpdate";
import { fetchAndMakeLocationObj } from "pages/monitoring/outlets/initiativesAdmin/utils/builders";

// TODO: Cargar solo las imagenes cuando solo falla ese pedazo y se creo la Ini
export function InitiativeDataForm() {
  const [formID, setformID] = useState(0);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});
  const [isPending, setIsPending] = useState(false);
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
        <GeneralInfoInput
          title="Información general"
          sectionInfo={initiative.current.general}
          sectionUpdater={handleFormUpdate("general")}
          validationErrorsObj={errors?.general ?? {}}
        />

        <FormListManager
          title="Ubicación de la iniciativa"
          sectionInfo={initiative.current.locations}
          AddItemComponent={LocationInput}
          maxItems={INITIATIVE_LOCATIONS_MAX_AMOUNT}
          renderMap={
            new Map<string, keyof LocationObj>([
              ["Departamento", "department"],
              ["Municipio", "municipality"],
              ["loca", "locality"],
            ])
          }
          renderRowCallback={fetchAndMakeLocationObj}
          sectionUpdater={handleFormUpdate("locations")}
          validationErrors={errors?.locations ?? []}
        />

        <div className="flex flex-col md:flex-row gap-2 items-start *:w-full">
          <FormListManager
            title="Información de contacto"
            sectionInfo={initiative.current.contacts}
            AddItemComponent={ContactInput}
            maxItems={INITIATIVE_CONTACTS_MAX_AMOUNT}
            renderMap={
              new Map<string, keyof InitiativeContact>([
                ["Correo 666", "email"],
                ["Teléfono", "phone"],
              ])
            }
            sectionUpdater={handleFormUpdate("contacts")}
            validationErrors={errors?.contacts ?? []}
          />

          <FormListManager
            title="líderezas y líderes de la iniciativa"
            sectionInfo={initiative.current.users}
            AddItemComponent={UsersInput}
            maxItems={INITIATIVE_LEADERS_MAX_AMOUNT}
            renderMap={new Map<string, keyof User>([["Nombre", "userName"]])}
            sectionUpdater={handleFormUpdate("users")}
            validationErrors={errors?.users ?? []}
          />
        </div>

        <ImagesInput
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
