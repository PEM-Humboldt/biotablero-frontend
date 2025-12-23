import { useCallback, useEffect, useState } from "react";
import { Check, CirclePlus, Eraser, SquarePen, UndoDot } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";

import type { LocationData } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  COLOMBIAN_DEPARTMENTS,
  getLocationInfoById,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";
import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { Label } from "@ui/shadCN/component/label";
import { TextAndErrorForLabel } from "@ui/TextAndErrorForLabel";
import { Combobox } from "@ui/ComboBox";
import { isMonitoringAPIError } from "pages/monitoring/api/monitoringAPI";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import type { LocationList } from "pages/monitoring/types/monitoring";
import type { LocationBasicInfo } from "pages/monitoring/types/requestParams";
import { locationAlreadyExist } from "pages/monitoring/outlets/initiativesAdmin/utils/validations";
import { StrValidator } from "@utils/validator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";

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
    setMunicipality("");
    setLocality("");

    if (department === "") {
      setMunicipalities([]);
      return;
    }

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

    const loc = await getLocationInfoById(update.locationId);
    if (loc === null) {
      return;
    }

    setDepartment(loc?.parent ? String(loc.parent.id) : String(loc.id));
    setMunicipality(loc?.parent ? String(loc.id) : "");
    setLocality(update?.locality ?? "");
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

    if (!isLocalityValid) {
      return;
    }

    const newLocation = {
      locationId: Number(municipality) || Number(department),
      locality,
    };

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
  };

  return (
    <>
      <TextAndErrorForLabel validationErrors={inputErr?.location ?? []}>
        <span className="sr-only">Ingresa la ubicación de la iniciativa</span>
      </TextAndErrorForLabel>
      <div className="flex gap-2 [&>label]:flex-1 items-end mb-4">
        <Label className="flex-1" htmlFor="departments">
          <span className="sr-only">Selecciona un Departamento</span>
          <Combobox
            id="departments"
            items={COLOMBIAN_DEPARTMENTS}
            value={department}
            setValue={setDepartment}
            keys={{ forValue: "value", forLabel: "name" }}
            uiText={{
              itemNotFound: "Departamento no encontrado",
              trigger: "Selecciona un departamento",
              inputPlaceholder: "buscar departamento",
            }}
          />
        </Label>

        <Label className="flex-1" htmlFor="departments">
          <span className="sr-only">Selecciona un municipio</span>
          <Combobox
            id="departments"
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
          />
        </Label>

        <Label className="flex-1" htmlFor="departments">
          <TextAndErrorForLabel validationErrors={inputErr?.locality ?? []}>
            <span className="sr-only">Escribe el nombre de la vereda</span>
          </TextAndErrorForLabel>
          <InputGroup>
            <InputGroupInput
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="Localidad"
              onBlur={isLocalityValid}
              aria-invalid={"locality" in inputErr}
              autoComplete="off"
              maxLength={INITIATIVE_LOCALITY_MAX_LENGTH}
              disabled={municipalities.length === 0}
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
        </Label>

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
            title="Reiniciar"
          >
            <span className="sr-only">Reiniciar</span>
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
    <table className="w-full [&_th]:px-2 [&_td]:px-2">
      <caption className="text-left border-b h4">
        Ubicación de la iniciativa
      </caption>

      <thead className="sr-only">
        <tr className="text-left [&_th]:font-normal">
          <th>Departamento</th>
          <th>Municipio</th>
          <th>Localidad</th>
          <th className="w-px"></th>
        </tr>
      </thead>

      <tbody>
        {selectedItems.map((values, i) => (
          <tr key={`${values.locationId}_${i}`} className="hover:bg-muted">
            <LocationDataCells values={values} />

            <td className="whitespace-nowrap w-px">
              <Button
                type="button"
                onClick={() => editItem(i)}
                variant="ghost-clean"
                className="mr-2"
                size="icon-sm"
              >
                <span className="sr-only">editar</span>
                <span aria-hidden="true">
                  <SquarePen className="size-4" />
                </span>
              </Button>

              <Button
                type="button"
                onClick={() => deleteItem(i)}
                variant="ghost-clean"
                size="icon-sm"
              >
                <span className="sr-only">borrar</span>
                <span aria-hidden="true">
                  <Eraser className="size-4" />
                </span>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LocationDataCells({ values }: { values: LocationData }) {
  const [locationInfo, setLocationInfo] = useState<LocationBasicInfo | null>(
    null,
  );

  useEffect(() => {
    const fetchLocationInfo = async () => {
      setLocationInfo(await getLocationInfoById(values.locationId));
    };
    void fetchLocationInfo();
  }, [values.locationId, values.locality]);

  return locationInfo === null ? (
    <td colSpan={3}>No se encontró la información intenta más tarde</td>
  ) : (
    <>
      <td className="whitespace-nowrap">
        {locationInfo?.parent !== undefined
          ? locationInfo.parent.name
          : locationInfo.name}
      </td>
      <td className="whitespace-nowrap">
        {locationInfo?.parent !== undefined ? locationInfo.name : "----"}
      </td>
      <td className="whitespace-nowrap">
        {values.locality ? values.locality : "--------"}
      </td>
    </>
  );
}
