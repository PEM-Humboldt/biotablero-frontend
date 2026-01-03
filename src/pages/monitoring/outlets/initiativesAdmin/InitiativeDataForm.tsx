import { useRef, useState } from "react";
import { Form } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@ui/shadCN/component/button-group";

import type {
  InitiativeDataForm,
  InitiativeDataFormErr,
  InitiativeToUpadate,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  isMonitoringAPIError,
  monitoringAPI,
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

export function InitiativeDataForm({
  dataToUpdate,
}: {
  dataToUpdate?: InitiativeToUpadate;
}) {
  const [formID, setformID] = useState(0);
  const [validationErrors, setValidationErrors] = useState<
    Partial<InitiativeDataFormErr>
  >({});
  const initiativeData = useRef<InitiativeDataForm>(
    getInitialInfo(dataToUpdate),
  );

  const isUpdate = dataToUpdate !== undefined;

  const handleReset = () => {
    initiativeData.current = getInitialInfo(dataToUpdate);
    setformID((prev) => prev + 1);
    setValidationErrors({});
  };

  function handleSectionUpate<K extends keyof InitiativeDataForm>(key: K) {
    function updateRef(value: InitiativeDataForm[K]) {
      // setValidationErrors(({ [key]: _, ...oldErr }) => oldErr);
      initiativeData.current[key] = value;
    }

    return updateRef;
  }

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    const currentErrors = validateFormClient(
      initiativeData.current,
      formClientValidations,
    );
    setValidationErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    try {
      const { general, ...partialPayload } = { ...initiativeData.current };
      const payload = { ...general, ...partialPayload };

      const res = await monitoringAPI({
        type: isUpdate ? "post" : "put",
        endpoint: `initiative${isUpdate ? `/${dataToUpdate.id}` : ""}`,
        options: {
          data: payload,
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      });

      if (isMonitoringAPIError(res)) {
        throw new Error(res.message);
      }

      console.log(res);
    } catch (err) {
      console.error("carajo", err);
    }
  };

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden">
      <h4 className="px-6 py-2 mb-0 text-base bg-primary text-primary-foreground">
        Nueva iniciativa
      </h4>
      <Form
        action=""
        key={formID}
        onReset={handleReset}
        onSubmit={(e) => void handleSubmit(e)}
        className="flex flex-col gap-2 p-6"
      >
        <InitiativeGeneralInfo
          title="Información general"
          sectionInfo={initiativeData.current.general}
          sectionUpdater={handleSectionUpate("general")}
          validationErrorsObj={validationErrors?.general ?? {}}
        />

        <FormListManager
          title="Ubicación de la iniciativa"
          maxItems={3}
          sectionInfo={initiativeData.current.locations}
          sectionUpdater={handleSectionUpate("locations")}
          AddItemComponent={LocationInput}
          CurrentItemsComponent={LocationDisplay}
          validationErrors={validationErrors?.locations ?? []}
        />

        <div className="flex flex-col md:flex-row gap-2 items-start *:w-full">
          <FormListManager
            title="Información de contacto"
            maxItems={5}
            sectionInfo={initiativeData.current.contacts}
            sectionUpdater={handleSectionUpate("contacts")}
            AddItemComponent={ContactInfoInput}
            CurrentItemsComponent={ContactInfoDisplay}
            validationErrors={validationErrors?.contacts ?? []}
          />

          <FormListManager
            title="líderezas y líderes de la iniciativa"
            maxItems={3}
            sectionInfo={initiativeData.current.users}
            sectionUpdater={handleSectionUpate("users")}
            AddItemComponent={UsersInfoInput}
            CurrentItemsComponent={UsersInfoDisplay}
            validationErrors={validationErrors?.users ?? []}
          />
        </div>

        {/* NOTE: Se invierten los elementos para que reset sea el ultimo tab */}
        <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
          <ButtonGroup>
            <Button>Crear</Button>
            <ButtonGroupSeparator />
            <Button onClick={(e) => void handleSubmit(e)} type="button">
              Crear y cargar archivos
            </Button>
          </ButtonGroup>
          <Button type="reset" variant="outline_destructive">
            Reiniciar el formulario
          </Button>
        </div>
      </Form>
    </div>
  );
}

function getInitialInfo(
  dataToUpdate?: InitiativeToUpadate,
): InitiativeDataForm {
  if (dataToUpdate) {
    const { name, shortName, description, ...initiativeData } = dataToUpdate;
    const general = { name, shortName: shortName ?? "", description };

    return { ...initiativeData, general };
  }

  return {
    general: { name: "", shortName: "", description: "" },
    locations: [],
    contacts: [],
    users: [],
  };
}
