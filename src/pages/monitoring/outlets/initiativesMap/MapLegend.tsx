import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router";

import { Combobox } from "@ui/ComboBox";
import { INITIATIVES_MAP_GRADIENT } from "@config/monitoring";

import { InitiativeIcon } from "pages/monitoring/outlets/initiativesMap/mapFinder/InitiativeIcon";
import {
  MAP_LAYERS,
  MAP_TILES,
} from "pages/monitoring/outlets/initiativesMap/layout/layers";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";
import { parseSimpleMarkdown } from "@utils/textParser";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/shadCN/component/collapsible";
import { Button } from "@ui/shadCN/component/button";
import { Check, ChevronDown, Expand, Layers, Minimize2 } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";

export function MapLegend({
  leastInitiativesPerDepartment,
  mostInitiativesPerDepartment,
  activeDepartments,
  tiles,
  setTiles,
  layers,
  setLayers,
}: {
  leastInitiativesPerDepartment: number;
  mostInitiativesPerDepartment: number;
  activeDepartments: { value: string; label: string }[];
  tiles: number;
  setTiles: Dispatch<SetStateAction<number>>;
  layers: number | null;
  setLayers: Dispatch<SetStateAction<number | null>>;
}) {
  const navigate = useNavigate();
  const [department, setDepartment] = useState<string>("");
  const { departmentId, initiativeId } = useParams();
  const [expanded, setExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    setDepartment(departmentId ?? "");
  }, [departmentId]);

  useEffect(() => {
    const inInitiative = initiativeId ? `/${initiativeId}` : "";
    const pathParams = department
      ? `/Departamento/${department}${inInitiative}`
      : "";
    void navigate(`/Monitoreo${pathParams}`);
  }, [department, initiativeId, navigate]);

  const gradientStyle = useMemo(() => {
    if (INITIATIVES_MAP_GRADIENT.length === 0) {
      return { backgroundColor: "transparent" };
    }
    if (INITIATIVES_MAP_GRADIENT.length === 1) {
      return { backgroundColor: INITIATIVES_MAP_GRADIENT[0].color };
    }

    const colors = INITIATIVES_MAP_GRADIENT.map(
      (g) => `${g.color} ${g.position * 100}%`,
    ).join(", ");

    return { backgroundImage: `linear-gradient(to right, ${colors})` };
  }, []);

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div
        className="absolute z-10 border border-primary/50 bottom-1 right-1 lg:top-4 lg:right-14 w-70 rounded-lg overflow-hidden shadow-md h-fit"
        role="group"
        aria-label={uiText.mapLegend.labelSr}
      >
        <div
          className={cn(
            "flex gap-2 justify-between items-center bg-primary transition-all duration-300 text-primary-foreground px-2",
            expanded ? "" : "rounded-b-lg",
          )}
        >
          <h4 className="flex gap-2 items-center text-lg m-0">
            {uiText.mapLegend.title}
          </h4>

          <CollapsibleTrigger asChild>
            <Button
              className="p-0 text-primary-foreground"
              variant="link"
              title={
                expanded
                  ? uiText.windowsUiText.expandedBtn.title
                  : uiText.windowsUiText.shinkedBtn.title
              }
              aria-label={
                expanded
                  ? uiText.windowsUiText.expandedBtn.sr
                  : uiText.windowsUiText.shinkedBtn.sr
              }
            >
              {expanded ? (
                <>
                  {uiText.windowsUiText.expandedBtn.label}
                  <Minimize2 />
                </>
              ) : (
                <>
                  {uiText.windowsUiText.shinkedBtn.label}
                  <Expand />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent
          className={cn(
            "p-4 space-y-4 text-sm  bg-background",
            "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden",
          )}
        >
          <div className="text-sm/5 [&_p]:mb-0 [&_p]:text-pretty [&_p]:text-sm/5 [&_strong]:font-semibold">
            {parseSimpleMarkdown(uiText.mapLegend.description)}
            {!initiativeId && (
              <Combobox
                items={activeDepartments}
                value={department ?? ""}
                setValue={setDepartment}
                keys={{ forLabel: "label", forValue: "value" }}
                uiText={uiText.mapLegend.deptSelection}
                className="pointer-events-auto mt-2"
              />
            )}
          </div>

          <hr className="border-muted" />

          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-3 pl-0.5">
              <InitiativeIcon className="w-6" />
              <span>{uiText.mapLegend.legends.initiative}</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary font-bold text-[10px] text-background border-4 border-background/40">
                N
              </div>
              <span>{uiText.mapLegend.legends.nearByInitiatives}</span>
            </li>
            <li className="flex flex-col">
              <span>{uiText.mapLegend.legends.initiativesPerDepartment}</span>
              <div className="border-l border-r border-foreground/40">
                <div className="h-6 w-full " style={gradientStyle} />
                <div className="flex justify-between px-1 text-foreground/80">
                  <span>{leastInitiativesPerDepartment}</span>
                  <span>{mostInitiativesPerDepartment}</span>
                </div>
              </div>
            </li>
          </ul>

          <label htmlFor="layerSelector" className="sr-only">
            {uiText.mapLegend.layerSelector.label}
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group w-full bg-cover bg-center justify-between outline outline-transparent hover:outline-2 outline-offset-2 hover:outline-primary bg-blend-luminosity"
                style={{
                  backgroundImage: `url("${MAP_TILES[tiles].uiThumbs.selection}")`,
                }}
              >
                <div className="flex gap-2 items-center">
                  <Layers /> {uiText.mapLegend.layerSelector.title}
                </div>
                <ChevronDown
                  className="relative top-px ml-2 size-5 transition duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="grid md:grid-cols-[repeat(2,max-content)] gap-4 w-auto p-2"
            >
              <div className="md:border-r md:border-r-grey-light md:pl-2 md:pr-4">
                <span className="font-normal">
                  {uiText.mapLegend.layerSelector.mapsTitle}
                </span>
                <ul className="mt-2 space-y-2">
                  {Object.entries(MAP_TILES).map(([key, value]) => (
                    <li key={`mapTile_${key}`}>
                      <Button
                        onClick={() => setTiles(Number(key))}
                        variant="link"
                        disabled={tiles === Number(key)}
                        className="w-40 p-0! justify-start"
                      >
                        <div className="flex gap-2 items-center  text-sm">
                          <img
                            src={value.uiThumbs.button}
                            alt=""
                            className="h-9 border border-primary/50 aspect-square rounded object-cover object-center"
                          />
                          {value.label}
                        </div>
                        {tiles === Number(key) && <Check />}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-normal">
                  {uiText.mapLegend.layerSelector.layersTitle}
                </span>
                <ul className="mt-2 space-y-2">
                  {Object.entries(MAP_LAYERS).map(([key, value]) => (
                    <li key={`mapLayer_${key}`}>
                      <Button
                        onClick={() =>
                          setLayers((oldLayer) =>
                            oldLayer === Number(key) ? null : Number(key),
                          )
                        }
                        variant="link"
                        className="w-50 p-0! justify-start"
                      >
                        <div className="flex gap-2 items-center  text-sm">
                          <img
                            src={value.buttonBkg}
                            alt=""
                            className="h-9 border border-primary/50 aspect-square rounded object-cover object-center"
                          />
                          {value.label}
                        </div>
                        {layers === Number(key) && <Check />}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
