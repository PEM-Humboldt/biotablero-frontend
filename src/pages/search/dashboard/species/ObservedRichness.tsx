import { useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadCN/component/select";
import { ShortInfo } from "@composites/ShortInfo";
import TextBoxes from "@ui/TextBoxes";
import { ErrorsList } from "@ui/LabelingWithErrors";

import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";

import {
  ObservedRichnessController,
  type ObservedRichnessDataType,
} from "pages/search/dashboard/species/ObservedRichnessController";
import { useSearchStateCTX } from "pages/search/hooks/SearchContext";
import type { textsObject } from "pages/search/types/texts";
import { speciesGroupLabels } from "pages/search/dashboard/species/commonDictionaries";
import { CircleAlert, LayersIcon, LeafIcon, MapPin } from "lucide-react";
import { ResponsiveBar } from "@nivo/bar";
import { LOCALE } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";
import { GraphLegend } from "@ui/GraphLegend";

const OBSERVED_RICHNESS_GRAPH_KEYS = ["CR", "EN", "VU"];
const customColorMap: Record<string, string> = {
  CR: "#5c150c",
  EN: "#bc472b",
  VU: "#d98242",
};

export function ObservedRichness() {
  const [isLoading, setIsLoading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [groupsAvailable, setGroupsAvailable] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showInfoGraph, setShowInfoGraph] = useState(false);
  const [renderData, setRenderData] = useState<{
    current: ObservedRichnessDataType | null;
    context: ObservedRichnessDataType | null;
  }>({ current: null, context: null });
  const [texts, setTexts] = useState<{ observedRichness: textsObject }>({
    observedRichness: { info: "", cons: "", meto: "", quote: "" },
  });

  const { areaType, areaId } = useSearchStateCTX();

  const controller = useRef(new ObservedRichnessController());

  if (areaType && areaId) {
    controller.current.setArea(areaType.id, areaId.id);
  }

  useEffect(() => {
    setIsLoading((old) => old + 1);
    Promise.all([
      controller.current.getTaxonomicGroups(),
      controller.current.getTexts("statsOnSpecies"),
    ])
      .then(([groups, texts]) => {
        setGroupsAvailable(groups);
        setTexts({ observedRichness: texts });
      })
      .catch((err) => {
        console.error(err);
        setErrors(["No fue posible obtener los datos del indicador"]);
      })
      .finally(() => {
        setIsLoading((old) => old - 1);
      });
  }, []);

  useEffect(() => {
    setIsLoading((old) => old + 1);
    Promise.all([
      controller.current.getCurrentData(selectedGroup),
      controller.current.getContextData(selectedGroup),
    ])
      .then(([current, context]) => {
        setRenderData({ current, context });
      })
      .catch((err) => {
        console.error(err);
        setErrors(["No fue posible obtener los datos del indicador"]);
      })
      .finally(() => {
        setIsLoading((old) => old - 1);
      });
  }, [selectedGroup]);

  return (
    <div className="graphcontainer pt6">
      <h4>Número de especies</h4>
      <IconTooltip title="Interpretación">
        <InfoIcon
          className={`metrics-info-icon${showInfoGraph ? " activeBox" : ""}`}
          onClick={() => setShowInfoGraph((prev) => !prev)}
        />
      </IconTooltip>

      {showInfoGraph && (
        <ShortInfo
          description={`<p>${texts.observedRichness.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      {Object.keys(groupsAvailable).length > 1 && (
        <Select
          value={selectedGroup}
          onValueChange={(val) => setSelectedGroup(val)}
        >
          <SelectTrigger id="gap-species-group" className="border-grey">
            <SelectValue placeholder="Grupo Taxonómico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {groupsAvailable.map((group) => (
              <SelectItem key={`selectGroup-${group}`} value={group}>
                {speciesGroupLabels[group] ?? group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <ErrorsList errorItems={errors} />

      <div className="">
        {isLoading ? (
          <div className="errorData">Cargando datos...</div>
        ) : (
          <>
            <ObservedRichnessTable data={renderData.current} />
            <ObservedRichnessTable data={renderData.context} isContext={true} />
          </>
        )}
      </div>

      <TextBoxes
        consText={texts.observedRichness.cons}
        metoText={texts.observedRichness.meto}
        quoteText={texts.observedRichness.quote}
        downloadData={controller.current.getDownloadData(renderData)}
        downloadName={`cifrasRiquezaObservada_${areaType?.label}_${areaId?.name}_vs_contextoPaís.csv`}
        isInfoOpen={showInfoGraph}
        toggleInfo={() => setShowInfoGraph((prev) => !prev)}
      />
    </div>
  );
}

function ObservedRichnessTable({
  data,
  isContext = false,
}: {
  data: ObservedRichnessDataType | null;
  isContext?: boolean;
}) {
  const { areaId } = useSearchStateCTX();
  if (!data) {
    return null;
  }

  const totalThreatened = data.threatenedTotal || 1;
  const chartData = [
    {
      CR: (data.barValues.CR / totalThreatened) * 100,
      EN: (data.barValues.EN / totalThreatened) * 100,
      VU: (data.barValues.VU / totalThreatened) * 100,
      rawCR: data.barValues.CR,
      rawEN: data.barValues.EN,
      rawVU: data.barValues.VU,
    },
  ];

  return (
    <div className="mb-4 border-b border-grey">
      <address className="flex gap-1 items-center text-sm text-grey-dark font-normal not-italic uppercase my-2">
        <MapPin size={16} />
        {isContext ? "Colombia" : areaId?.name}
      </address>

      <ul
        className={cn(
          "flex flex-wrap gap-2",
          "*:flex-1 *:first:flex-none *:border *:border-grey *:p-2 *:rounded-lg",
          "[&_li>span:first-child]:text-[#888] [&_li>span:first-child]:text-sm [&_li>span:first-child]:font-normal [&_li>span:first-child]:flex [&_li>span:first-child]:gap-1 [&_li>span:first-child]:items-center",
        )}
      >
        <li
          className={cn(
            "w-full",
            isContext ? "flex gap-2 justify-between" : "",
          )}
          title={"Total especies observadas"}
        >
          <span>
            <LeafIcon size={14} /> Total especies observadas
          </span>
          <span
            className={cn("font-black", isContext ? "text-lg" : "text-4xl")}
          >
            {data.total.toLocaleString(LOCALE)}
          </span>
        </li>
        <li title={"Especies endémicas"}>
          <span>
            <MapPin size={14} /> Endémicas
          </span>
          <span
            className={cn("font-black", isContext ? "text-base" : "text-xl")}
          >
            {data.endemic}
          </span>
        </li>
        <li title={"Amenazadas"}>
          <span>
            <CircleAlert size={14} /> Amenazadas
          </span>
          <span
            className={cn("font-black", isContext ? "text-base" : "text-xl")}
          >
            {data.threatenedTotal}
          </span>
        </li>
        <li title={"Endémicas amenazadas"}>
          <span>
            <CircleAlert size={14} /> Endém. amenz.
          </span>
          <span
            className={cn("font-black", isContext ? "text-base" : "text-xl")}
          >
            {data.endemicThreatened}
          </span>
        </li>
        <li title={"Invasoras"}>
          <span>
            <LayersIcon size={14} /> Invasoras
          </span>
          <span
            className={cn("font-black", isContext ? "text-base" : "text-xl")}
          >
            {data.invasive}
          </span>
        </li>
      </ul>

      <div className="mt-2">
        <span className="flex gap-2 justify-between text-[#888] text-sm font-normal">
          <span>Amenazadas por categoría UICN</span>
          <span className="text-grey-dark font-bold">
            {data.threatenedTotal.toLocaleString(LOCALE)}
          </span>
        </span>
        <div className="h-6 w-full rounded-lg overflow-hidden">
          <ResponsiveBar
            data={chartData}
            keys={OBSERVED_RICHNESS_GRAPH_KEYS}
            layout="horizontal"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            padding={0}
            colors={({ id }) => customColorMap[id as string] ?? "#FF0000"}
            valueScale={{ type: "linear", min: 0, max: 100 }}
            enableGridY={false}
            enableGridX={false}
            axisLeft={null}
            axisBottom={null}
            enableLabel={false}
            isInteractive={false}
          />
        </div>
        <GraphLegend
          keys={OBSERVED_RICHNESS_GRAPH_KEYS}
          customColorMap={customColorMap}
          renderValues={data.barValues}
          className="justify-start px-0 pt-1 text-[#888]!"
        />
      </div>
    </div>
  );
}
