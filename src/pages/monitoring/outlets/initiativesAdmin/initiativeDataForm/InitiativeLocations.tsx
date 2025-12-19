import { useCallback, useEffect, useState } from "react";
import { Check, CirclePlus, Eraser, SquarePen, UndoDot } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { Input } from "@ui/shadCN/component/input";

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
import { LocationBasicInfo } from "pages/monitoring/types/requestParams";

export function LocationInput({
  selectedItems,
  setter,
  update,
}: ItemEditorProps<LocationData>) {
  const [department, setDepartment] = useState<string>("");
  const [municipalities, setMunicipalities] = useState<LocationList[]>([]);
  const [municipality, setMunicipality] = useState<string>("");
  const [locality, setLocality] = useState("");

  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    setMunicipality("");
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

  const reset = useCallback(() => {
    setDepartment("");
    setMunicipality("");
    setLocality(update?.locality ?? "");
    setError([]);
  }, [update]);

  useEffect(() => {
    if (!update) {
      return;
    }

    reset();
  }, [update, reset]);

  const handleSave = () => {
    if (department === "") {
      setError(["se debe seleccionar al menos un departamento"]);
      return;
    }

    const newLocation = {
      locationId: Number(municipality) || Number(department),
      locality,
    };
    setter((savedData) => [...savedData, newLocation]);
    reset();
  };

  return (
    <>
      <TextAndErrorForLabel validationErrors={error}>
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
          <span className="sr-only">Escribe el nombre de la vereda</span>
          <Input
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            placeholder="Localidad"
          />
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
            onClick={reset}
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
        {selectedItems.map((values, i) => {
          const locationInfo = getLocationInfoById(values.locationId);

          return locationInfo === null ? (
            <tr>
              <td colSpan={4}>Pailas, no tengo la data</td>
            </tr>
          ) : (
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
                  <span className="sr-only">
                    editar la siguiente información
                  </span>
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
                  <span className="sr-only">
                    borrar la siguiente información
                  </span>
                  <span aria-hidden="true">
                    <Eraser className="size-4" />
                  </span>
                </Button>
              </td>
            </tr>
          );
        })}
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
    <td colSpan={3}>Pailas, no tengo la data</td>
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
