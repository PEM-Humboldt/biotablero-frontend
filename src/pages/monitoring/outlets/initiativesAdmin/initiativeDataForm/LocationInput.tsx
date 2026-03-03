import { type SetStateAction, useCallback, useEffect, useState } from "react";

import { Label } from "@ui/shadCN/component/label";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Combobox } from "@ui/ComboBox";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { StrValidator } from "@utils/strValidator";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { INITIATIVE_LOCALITY_MAX_LENGTH } from "@config/monitoring";

import { uiText } from "pages/monitoring/outlets/initiativesAdmin/layout/uiText";
import {
  isLocationObj,
  type LocationDataBasic,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  getColombianDepartments,
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
  const [departments, setDepartments] = useState<
    { name: string; value: number }[]
  >([]);
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [municipalities, setMunicipalities] = useState<LocationList[]>([]);
  const [municipality, setMunicipality] = useState<string>("");
  const [locality, setLocality] = useState("");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const getDepts = async () => {
      const depts = await getColombianDepartments();
      setDepartments(depts);
    };

    void getDepts();
  }, []);

  useEffect(() => {
    if (currentDepartment === "") {
      setMunicipalities([]);
      return;
    }

    const getMunicipalities = async () => {
      try {
        const municipalitiesList =
          await getMunicipalitiesByDepartment(currentDepartment);
        if (isMonitoringAPIError(municipalitiesList)) {
          setInputErr((oldErr) => ({
            ...oldErr,
            location: municipalitiesList.data.map((err) => err.msg),
          }));
          return;
        }

        setMunicipalities(municipalitiesList);
      } catch (err) {
        console.error(err);
      }
    };

    void getMunicipalities();
  }, [currentDepartment]);

  const reset = useCallback(async () => {
    setInputErr({});

    if (update === null) {
      setCurrentDepartment("");
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
        location: [uiText.error.noUpdateData],
      }));
      return;
    }

    setCurrentDepartment(String(loc.departmentId));
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
    if (currentDepartment === "") {
      setInputErr((oldErr) => ({
        ...oldErr,
        location: [
          uiText.initiative.module.locations.validation.atLeastOneDepartment,
        ],
      }));
      return;
    }
    if (!isLocalityValid()) {
      return;
    }
    const newLocation: LocationDataBasic = {
      locationId: Number(municipality) || Number(currentDepartment),
    };

    if (locality !== "") {
      newLocation.locality = locality;
    }

    if (selectedItems && locationAlreadyExist(newLocation, selectedItems)) {
      setInputErr((oldErr) => ({
        ...oldErr,
        location: [uiText.initiative.module.locations.validation.alreadyExist],
      }));
      return;
    }

    setter(newLocation as T);
    setCurrentDepartment("");
    setMunicipality("");
    setLocality("");

    setInputErr({});
  };

  const handleDiscard = () => {
    if (update && discard) {
      discard();
    }
    setCurrentDepartment("");
    setMunicipality("");
    setLocality("");

    setInputErr({});
  };

  const handleChangeDepartment = (action: SetStateAction<string>) => {
    setCurrentDepartment(action);
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
          <span className="sr-only">
            {uiText.initiative.module.locations.field.dept.label}
          </span>
        )}
      </LabelAndErrors>

      <div className="form-input-list">
        <Combobox
          id="department"
          items={departments}
          value={currentDepartment}
          setValue={(e) => handleChangeDepartment(e)}
          keys={{ forValue: "value", forLabel: "name" }}
          uiText={{
            itemNotFound:
              uiText.initiative.module.locations.field.dept.notFound,
            trigger: uiText.initiative.module.locations.field.dept.trigger,
            inputPlaceholder:
              uiText.initiative.module.locations.field.dept.placeholder,
          }}
          aria-required="true"
          aria-invalid={inputErr.location !== undefined}
          aria-describedby={inputErr.location ? "errors_location" : undefined}
        />

        <Label className="sr-only" htmlFor="municipality">
          {uiText.initiative.module.locations.field.muni.notFound}
        </Label>
        <Combobox
          id="municipality"
          items={municipalities}
          value={municipality}
          setValue={setMunicipality}
          keys={{ forValue: "value", forLabel: "name" }}
          uiText={{
            itemNotFound:
              uiText.initiative.module.locations.field.muni.notFound,
            trigger: uiText.initiative.module.locations.field.muni.trigger,
            inputPlaceholder:
              uiText.initiative.module.locations.field.muni.placeholder,
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
            <span className="sr-only">
              {uiText.initiative.module.locations.field.local.label}
            </span>
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
              placeholder={
                uiText.initiative.module.locations.field.local.placeholder
              }
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
