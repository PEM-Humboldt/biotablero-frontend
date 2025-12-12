import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Form } from "react-router";

import { Button } from "@ui/shadCN/component/button";

// import {
//   isMonitoringAPIError,
//   monitoringAPI,
// } from "pages/monitoring/api/monitoringAPI";
import type {
  InitiativeDataForm,
  InitiativeToUpadateForm,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { InitiativeLocations } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeLocations";
import { InitiativeLeaders } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeLeaders";
import { InitiativeContact } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeContact";
import { InitiativeImages } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeImages";
import { InitiativeGeneralInfo } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InitiativeGeneralInfo";
import { debouncer } from "@utils/debouncer";

const getInitialState = (
  dataToUpdate?: InitiativeToUpadateForm,
): InitiativeDataForm => {
  if (dataToUpdate) {
    const { id: _, ...oldInitiativeData } = dataToUpdate;
    return oldInitiativeData;
  }

  return {
    name: "",
    shortName: "",
    description: "",
    locations: [],
    contacts: [],
    users: [],
  };
};

export function InitiativeDataForm({
  dataToUpdate,
}: {
  dataToUpdate?: InitiativeToUpadateForm;
}) {
  const [formID, setformID] = useState(0);

  const initiativeData = useRef<InitiativeDataForm>(
    getInitialState(dataToUpdate),
  );

  useEffect(() => {
    if (dataToUpdate) {
      initiativeData.current = getInitialState(dataToUpdate);
      setformID((prev) => prev + 1); // Forzamos a los hijos a mostrar la info cargada
    }
  }, [dataToUpdate]);

  const handleReset = () => {
    initiativeData.current = getInitialState(dataToUpdate);
    setformID((prev) => prev + 1);
  };

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
      onReset={handleReset}
      onSubmit={handleSubmit}
      className="bg-white flex flex-col gap-8 m-4 p-4 rounded-lg"
    >
      <fieldset>
        <legend>Información general</legend>
        <InitiativeGeneralInfo
          key={formID}
          formDataRef={initiativeData}
          formErrors={{ name: ["carajo"] }}
        />
      </fieldset>

      <fieldset>
        <legend>Dónde está ubicada</legend>
        <InitiativeLocations />
      </fieldset>

      <fieldset>
        <legend>Información de contacto</legend>
        <InitiativeContact />
      </fieldset>

      <fieldset>
        <legend>Quienes son los y las líderezas</legend>
        <InitiativeLeaders />
      </fieldset>

      <fieldset>
        <legend>Imagenes de la iniciativa</legend>
        <InitiativeImages />
      </fieldset>

      {/* NOTE: Se invierten los elementos para que reset sea el ultimo tab */}
      <div className="flex flex-row-reverse gap-4">
        <Button>Crear la iniciativa</Button>
        <Button type="reset" variant="outline_destructive">
          Reiniciar el formulario
        </Button>
      </div>
    </Form>
  );
}
