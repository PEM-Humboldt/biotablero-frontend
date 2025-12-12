import { Button } from "@ui/shadCN/component/button";
import { Input } from "@ui/shadCN/component/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import { useEffect, useRef, useState } from "react";
import {
  COLOMBIAN_DEPARTMENTS,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";
import { CircleMinus, CirclePlus } from "lucide-react";

export function InitiativeLocations() {
  const [polygonAvailable, setPolyconAvailable] = useState(true);
  const [municipalities, setMunicipalities] = useState({});

  // TODO: Revisar con la actualizacion de la locaclizacion del fron
  return (
    <div>
      <InitiativeLocationInput
        municipalities={municipalities}
        setMunicipalities={setMunicipalities}
      />

      {polygonAvailable && (
        <label htmlFor="polygon">
          Cargar polígono personalizado
          <Input className="hidden" type="file" id="polygon" />
        </label>
      )}
    </div>
  );
}

function InitiativeLocationInput({ municipalities, setMunicipalities }) {
  const [department, setDepartment] = useState("");
  const [municipality, setMunicipality] = useState("");

  useEffect(() => {
    if (department === "") {
      setMunicipality("");
    }
  }, [department]);

  return (
    <div className="flex flex-wrap [&>label]:flex-1 gap-2">
      <label htmlFor="department">
        <span className="sr-only">Departamento</span>
        <NativeSelect
          id="department"
          onChange={(e) => setDepartment(e.target.value)}
        >
          <NativeSelectOption value="">
            Selecciona un departamento
          </NativeSelectOption>
          {COLOMBIAN_DEPARTMENTS.map(({ name, value }) => (
            <NativeSelectOption key={`${name}_${value}`} value={value}>
              {name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </label>

      <label htmlFor="municipality">
        <span className="sr-only">Municipio</span>
        <NativeSelect id="municipality">
          <NativeSelectOption value="">
            Selecciona un municipio
          </NativeSelectOption>
        </NativeSelect>
      </label>

      <label htmlFor="locality">
        <span className="sr-only">localidad</span>
        <Input
          name="locality"
          id="locality"
          type="text"
          placeholder="Escribe el nombre de la localidad"
        />
      </label>

      <Button type="button" variant="outline" size="icon">
        <span className="sr-only">Añadir una nueva ubicacion</span>
        <span aria-hidden="true">
          <CirclePlus className="size-5" />
        </span>
      </Button>
    </div>
  );
}
