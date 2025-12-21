import { useEffect, useRef, useState } from "react";
import { Form } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@ui/shadCN/component/button-group";

// import {
//   isMonitoringAPIError,
//   monitoringAPI,
// } from "pages/monitoring/api/monitoringAPI";
// import { debouncer } from "@utils/debouncer";

import type {
  InitiativeDataForm,
  InitiativeToUpadate,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
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
import { InitiativeImages } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeImages";
import { InitiativeGeneralInfo } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeGeneralInfo";
import { FormListManager } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/FormListManager";

export function InitiativeDataForm({
  dataToUpdate,
}: {
  dataToUpdate?: InitiativeToUpadate;
}) {
  const [formID, setformID] = useState(0);
  const initiativeData = useRef<InitiativeDataForm>(
    getInitialInfo(dataToUpdate),
  );

  const handleReset = () => {
    initiativeData.current = getInitialInfo(dataToUpdate);
    setformID((prev) => prev + 1);
  };

  function handleSectionUpate<K extends keyof InitiativeDataForm>(key: K) {
    function updateRef(value: InitiativeDataForm[K]) {
      initiativeData.current[key] = value;
    }

    return updateRef;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      console.log(initiativeData.current);
      // const res = await monitoringAPI({
      //   type: dataToUpdate === undefined ? "put" : "post",
      //   endpoint: `initiative${dataToUpdate !== undefined && `/${dataToUpdate.id}`}`,
      //   options: {
      //     data: initiativeData,
      //     headers: {
      //       accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //   },
      // });
      //
      // if (isMonitoringAPIError(res)) {
      //   throw new Error(res.message);
      // }

      // TODO: Confirmación de usuario y cerrar pantalla
      // console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form
      action=""
      key={formID}
      onReset={handleReset}
      className="bg-white flex flex-col gap-8 m-4 p-4 rounded-lg"
    >
      <fieldset>
        <legend>Información general</legend>
        <InitiativeGeneralInfo
          sectionInfo={initiativeData.current.general}
          sectionUpdater={handleSectionUpate("general")}
          serverValidationErrors={{}}
        />
      </fieldset>

      <fieldset>
        <legend>Dónde está ubicada</legend>
        <FormListManager
          maxItems={3}
          sectionInfo={initiativeData.current.locations}
          sectionUpdater={handleSectionUpate("locations")}
          AddItemComponent={LocationInput}
          CurrentItemsComponent={LocationDisplay}
          serverValidationErrors={{}}
        />
      </fieldset>

      <fieldset>
        <legend>Contacto * </legend>
        <FormListManager
          maxItems={5}
          sectionInfo={initiativeData.current.contacts}
          sectionUpdater={handleSectionUpate("contacts")}
          AddItemComponent={ContactInfoInput}
          CurrentItemsComponent={ContactInfoDisplay}
          serverValidationErrors={{}}
        />
      </fieldset>

      <fieldset>
        <legend>líderezas y líderes de la iniciativa</legend>
        <FormListManager
          maxItems={3}
          sectionInfo={initiativeData.current.users}
          sectionUpdater={handleSectionUpate("users")}
          AddItemComponent={UsersInfoInput}
          CurrentItemsComponent={UsersInfoDisplay}
          serverValidationErrors={{}}
        />
      </fieldset>

      {/* NOTE: Se invierten los elementos para que reset sea el ultimo tab */}
      <div className="flex flex-row-reverse gap-4">
        <ButtonGroup>
          <Button onClick={handleSubmit} type="button">
            Crear y cargar archivos
          </Button>
          <ButtonGroupSeparator />
          <Button onClick={handleSubmit} type="button">
            Crear
          </Button>
        </ButtonGroup>
        <Button type="reset" variant="outline_destructive">
          Reiniciar el formulario
        </Button>
      </div>
    </Form>
  );
}

function getInitialInfo(
  dataToUpdate?: InitiativeToUpadate,
): InitiativeDataForm {
  if (dataToUpdate) {
    const {
      id: _,
      name,
      shortName,
      description,
      ...oldInitiativeData
    } = dataToUpdate;

    return { ...oldInitiativeData, general: { name, shortName, description } };
  }

  return {
    general: {
      name: "",
      shortName: "",
      description: "",
    },
    locations: [],
    contacts: [],
    users: [],
  };
}
