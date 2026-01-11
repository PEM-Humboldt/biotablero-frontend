import { type SetStateAction, useCallback, useEffect, useState } from "react";
import { Check, CirclePlus, Eraser, SquarePen, UndoDot } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";

import {
  isLocationObj,
  type LocationObj,
  type LocationData,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  COLOMBIAN_DEPARTMENTS,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";
import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { Label } from "@ui/shadCN/component/label";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Combobox } from "@ui/ComboBox";
import { isMonitoringAPIError } from "pages/monitoring/api/monitoringAPI";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import type { LocationList } from "pages/monitoring/types/monitoring";
import { locationAlreadyExist } from "pages/monitoring/outlets/initiativesAdmin/utils/fieldClientValidations";
import { StrValidator } from "@utils/strValidator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { fetchAndMakeLocationObj } from "pages/monitoring/outlets/initiativesAdmin/utils/builders";

const INITIATIVE_LOCALITY_MAX_LENGTH = 300;

export function LocationInput({
  selectedItems,
  setter,
  update,
}: ItemEditorProps<LocationData>) {
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
      : await fetchAndMakeLocationObj(update.locationId, update.locality);

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
    const newLocation: LocationData = {
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

    setter((savedData) => [...savedData, newLocation]);
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

        <ButtonGroup>
          <Button
            onClick={handleSave}
            type="button"
            variant="outline"
            size="icon"
            title={update !== null ? "Guardar cambios" : "Añadir ubicación"}
          >
            <span className="sr-only">
              {update !== null ? "Guardar cambios" : "Añadir ubicación"}
            </span>
            <span aria-hidden="true">
              {update !== null ? (
                <Check className="size-5" />
              ) : (
                <CirclePlus className="size-5" />
              )}
            </span>
          </Button>

          <Button
            onClick={() => void reset()}
            type="button"
            variant="outline"
            size="icon"
            title="Restablecer campos"
          >
            <span className="sr-only">Restablecer campos</span>
            <span aria-hidden="true">
              <UndoDot className="size-5" />
            </span>
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export function LocationDisplay({
  selectedItems,
  editItem,
  deleteItem,
}: ItemsRenderProps<LocationData>) {
  return (
    <div className="table-form-display-container">
      <table className="table-form-display">
        <caption className="sr-only">
          Ubicaciones registradas de la iniciativa
        </caption>

        <thead>
          <tr>
            <th>Departamento</th>
            <th>Municipio</th>
            <th>Vereda</th>
            <th className="w-24">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {selectedItems.map((values, i) => (
            <tr key={`${values.locality}_${i}`}>
              <LocationDataCells values={values} />

              <td className="table-form-actions">
                <Button
                  type="button"
                  onClick={() => editItem(i)}
                  variant="ghost-clean"
                  size="icon-sm"
                  title="Editar"
                >
                  <span className="sr-only">Editar esta ubicación</span>
                  <span aria-hidden="true">
                    <SquarePen className="size-4" />
                  </span>
                </Button>

                <Button
                  type="button"
                  onClick={() => deleteItem(i)}
                  variant="ghost-clean"
                  size="icon-sm"
                  title="Borrar"
                >
                  <span className="sr-only">Borrar esta ubicación</span>
                  <span aria-hidden="true">
                    <Eraser className="size-4" />
                  </span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LocationDataCells({ values }: { values: LocationData | LocationObj }) {
  const [locationInfo, setLocationInfo] = useState<LocationObj | null>(null);

  useEffect(() => {
    if (isLocationObj(values)) {
      setLocationInfo(values);
      return;
    }

    const fetchLocationInfo = async () => {
      setLocationInfo(
        await fetchAndMakeLocationObj(values.locationId, values.locality),
      );
    };
    void fetchLocationInfo();
  }, [values]);

  return locationInfo === null ? (
    <td colSpan={3}>No se encontró la información intenta más tarde</td>
  ) : (
    <>
      <td>{locationInfo.department}</td>
      <td>{locationInfo.municipality ?? "---"}</td>
      <td>{locationInfo.locality ?? "---"}</td>
    </>
  );
}
