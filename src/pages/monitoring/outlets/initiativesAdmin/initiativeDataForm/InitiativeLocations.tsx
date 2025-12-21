import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import type { LocationBasicInfo } from "pages/monitoring/types/requestParams";
import { locationAlreadyExist } from "pages/monitoring/outlets/initiativesAdmin/utils/validations";

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

  const handleChangeDepartment: Dispatch<SetStateAction<string>> = (value) => {
    const nextValue = typeof value === "function" ? value(department) : value;
    setDepartment(nextValue);

    if (nextValue !== department) {
      setMunicipality("");
      setLocality("");
    }
  };

  const reset = useCallback(async () => {
    setError([]);
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

    if (selectedItems && locationAlreadyExist(newLocation, selectedItems)) {
      setError(["Ya existe esa ubicación"]);
      return;
    }

    setter((savedData) => [...savedData, newLocation]);
    setDepartment("");
    setMunicipality("");
    setLocality("");
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
            setValue={handleChangeDepartment}
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
