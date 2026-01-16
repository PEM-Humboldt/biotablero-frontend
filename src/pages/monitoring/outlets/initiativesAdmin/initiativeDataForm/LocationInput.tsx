import { type SetStateAction, useCallback, useEffect, useState } from "react";

import { Label } from "@ui/shadCN/component/label";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Combobox } from "@ui/ComboBox";
import { isMonitoringAPIError } from "pages/monitoring/api/monitoringAPI";
import { StrValidator } from "@utils/strValidator";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { INITIATIVE_LOCALITY_MAX_LENGTH } from "@config/monitoring";

import {
  isLocationObj,
  type LocationDataBasic,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  COLOMBIAN_DEPARTMENTS,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";
import type { ItemEditorProps } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { LocationList } from "pages/monitoring/types/monitoring";
import { locationAlreadyExist } from "pages/monitoring/outlets/initiativesAdmin/utils/fieldClientValidations";
import { fetchAndMakeLocationObj } from "pages/monitoring/outlets/initiativesAdmin/utils/builders";
import { InputListActionButtons } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InputListActionButtons";

export function LocationInput<T extends LocationDataBasic>({
  selectedItems,
  setter,
  update,
  discard,
  disabled = false,
}: ItemEditorProps<T>) {
  const [department, setDepartment] = useState<string>("");
  const [municipalities, setMunicipalities] = useState<LocationList[]>([]);
  const [municipality, setMunicipality] = useState<string>("");
  const [locality, setLocality] = useState("");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (department === "") {
      setMunicipalities([]);
      return;
    }

    setInputErr((oldErr) => ({ ...oldErr, location: [] }));

    const getMunicipalities = async () => {
      try {
        const municipalitiesList =
          await getMunicipalitiesByDepartment(department);
        if (isMonitoringAPIError(municipalitiesList)) {
          throw new Error(municipalitiesList.message);
        }

        setMunicipalities(municipalitiesList);
      } catch (err) {
        console.error(err);
      }
    };

    void getMunicipalities();
  }, [department]);

  const reset = useCallback(async () => {
    setInputErr({});

    if (update === null) {
      setDepartment("");
      setMunicipality("");
      setLocality("");
      return;
    }

    const loc = isLocationObj(update)
      ? update
      : await fetchAndMakeLocationObj(update);

    if (loc === null) {
      setInputErr((oldErr) => ({
        ...oldErr,
        location: ["No se pudo actualizar la información, intente más tarde."],
      }));
      return;
    }

    setDepartment(String(loc.departmentId));
    setMunicipality(loc.municipalityId ? String(loc.municipalityId) : "");
    setLocality(loc.locality ?? "");
  }, [update]);

  useEffect(() => {
    void reset();
  }, [reset]);

  const isLocalityValid = () => {
    const [cleanLocality, localityErrors] = new StrValidator(locality)
      .isOptional()
      .sanitize()
      .hasLengthLessOrEqualThan(INITIATIVE_LOCALITY_MAX_LENGTH).result;

    if (localityErrors.length > 0) {
      setInputErr((oldErr) => ({ ...oldErr, locality: localityErrors }));
      return false;
    }

    setLocality(cleanLocality);
    return true;
  };

  const handleSave = () => {
    if (department === "") {
      setInputErr((oldErr) => ({
        ...oldErr,
        location: ["se debe seleccionar al menos un departamento"],
      }));
      return;
    }
    if (!isLocalityValid()) {
      return;
    }
    const newLocation: LocationDataBasic = {
      locationId: Number(municipality) || Number(department),
    };

    if (locality !== "") {
      newLocation.locality = locality;
    }

    if (selectedItems && locationAlreadyExist(newLocation, selectedItems)) {
      setInputErr((oldErr) => ({
        ...oldErr,
        location: ["Ya existe esa ubicación"],
      }));
      return;
    }

    setter(newLocation as T);
    setDepartment("");
    setMunicipality("");
    setLocality("");

    setInputErr({});
  };

  const handleDiscard = () => {
    if (update && discard) {
      discard();
    }
    setDepartment("");
    setMunicipality("");
    setLocality("");

    setInputErr({});
  };

  const handleChangeDepartment = (action: SetStateAction<string>) => {
    setDepartment(action);
    setMunicipality("");
    setLocality("");
  };

  return (
    <>
      <LabelAndErrors
        errID="errors_location"
        validationErrors={inputErr.location ?? []}
        htmlFor="department"
      >
        {inputErr?.location && (
          <span className="sr-only">Selecciona un Departamento</span>
        )}
      </LabelAndErrors>

      <div className="form-input-list">
        <Combobox
          id="department"
          items={COLOMBIAN_DEPARTMENTS}
          value={department}
          setValue={(e) => handleChangeDepartment(e)}
          keys={{ forValue: "value", forLabel: "name" }}
          uiText={{
            itemNotFound: "Departamento no encontrado",
            trigger: "Selecciona un departamento",
            inputPlaceholder: "buscar departamento",
          }}
          aria-required="true"
          aria-invalid={inputErr.location !== undefined}
          aria-describedby={inputErr.location ? "errors_location" : undefined}
        />

        <Label className="sr-only" htmlFor="municipality">
          Selecciona un municipio
        </Label>
        <Combobox
          id="municipality"
          items={municipalities}
          value={municipality}
          setValue={setMunicipality}
          keys={{ forValue: "value", forLabel: "name" }}
          uiText={{
            itemNotFound: "Municipio no encontrado",
            trigger: "Selecciona un municipio",
            inputPlaceholder: "buscar municipio",
          }}
          disabled={municipalities.length === 0}
          aria-invalid={inputErr.location !== undefined}
          aria-describedby={inputErr.location ? "errors_location" : undefined}
        />

        <div>
          <LabelAndErrors
            htmlFor="locality"
            errID="errors_locality"
            validationErrors={inputErr.locality ?? []}
          >
            <span className="sr-only">Escribe el nombre de la vereda</span>
          </LabelAndErrors>
          <InputGroup>
            <InputGroupInput
              name="locality"
              id="locality"
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              onBlur={isLocalityValid}
              autoComplete="off"
              placeholder="Nombre de la vereda"
              maxLength={INITIATIVE_LOCALITY_MAX_LENGTH}
              disabled={municipality === ""}
              aria-invalid={inputErr.locality !== undefined}
              aria-describedby={
                inputErr.locality ? "errors_locality" : undefined
              }
            />
            <InputGroupAddon
              align="inline-end"
              className={inputWarnColor(
                locality,
                INITIATIVE_LOCALITY_MAX_LENGTH,
                0.8,
              )}
            >
              {inputLengthCount(locality, INITIATIVE_LOCALITY_MAX_LENGTH, 0.6)}
            </InputGroupAddon>
          </InputGroup>
        </div>

        <InputListActionButtons
          update={update}
          handleSave={handleSave}
          handleDiscard={handleDiscard}
          reset={() => void reset()}
          disabled={disabled}
        />
      </div>
    </>
  );
}
