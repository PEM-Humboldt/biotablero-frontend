import { INITIAVIVES_MAP_GRADIENT } from "@config/monitoring";
import { InitiativeIcon } from "pages/monitoring/outlets/initiativesMap/mapFinder/InitiativeIcon";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Combobox } from "@ui/ComboBox";
import { useNavigate, useParams } from "react-router";

export function MapLegend({
  lowInitiativePerDepartment,
  highInitiativePerDepartment,
  departments,
  layers,
  setLayers,
}: {
  lowInitiativePerDepartment: number;
  highInitiativePerDepartment: number;
  departments: { value: string; label: string }[];
  layers: { value: string; label: string }[];
  setLayer: Dispatch<SetStateAction<string>>;
}) {
  const navigate = useNavigate();
  const [department, setDepartment] = useState<string>("");
  const prvDept = useRef<string | undefined>(undefined);
  const { departmentId, initiativeId } = useParams();

  useEffect(() => {
    const changeTo = department === prvDept.current ? departmentId : department;
    prvDept.current = changeTo;
    setDepartment(changeTo ?? "");

    void navigate(changeTo ? `/Monitoreo/Dept/${changeTo}` : "/Monitoreo");
  }, [departmentId, department, navigate]);

  const gradientStyle = useMemo(() => {
    if (INITIAVIVES_MAP_GRADIENT.length === 0) {
      return { backgroundColor: "transparent" };
    }
    if (INITIAVIVES_MAP_GRADIENT.length === 1) {
      return { backgroundColor: INITIAVIVES_MAP_GRADIENT[0].color };
    }

    const colors = INITIAVIVES_MAP_GRADIENT.map(
      (g) => `${g.color} ${g.position * 100}%`,
    ).join(", ");

    return { backgroundImage: `linear-gradient(to right, ${colors})` };
  }, []);

  return (
    <div className="leaflet-top leaflet-right mr-12 mt-2 bg-background p-4 rounded-lg max-w-[300px] space-y-4 text-sm">
      <div className="text-sm/5">
        Selecciona un departamento o iniciativa para ver sus cifras generales.
        Desde el panel lateral puedes ir a su perfil o indicadores.
        {!initiativeId && (
          <Combobox
            items={departments}
            value={department ?? ""}
            setValue={setDepartment}
            keys={{ forLabel: "label", forValue: "value" }}
            uiText={{
              itemNotFound: "",
              trigger: "Selecciona un departamento",
              inputPlaceholder: "",
            }}
            className="pointer-events-auto mt-2"
          />
        )}
      </div>

      <hr className="border-muted" />

      <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-3 pl-0.5">
          <InitiativeIcon className="w-6" />
          <span>Iniciativa</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary font-bold text-[10px] text-background border-4 border-background/40">
            12
          </div>
          <span>Iniciativas cercanas</span>
        </li>
        <li className="flex flex-col">
          <span>Iniciativas por departamento</span>
          <div className="border-l border-r border-foreground/40">
            <div className="h-6 w-full " style={gradientStyle} />
            <div className="flex justify-between px-1 text-foreground/80">
              <span>{lowInitiativePerDepartment}</span>
              <span>{highInitiativePerDepartment}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
