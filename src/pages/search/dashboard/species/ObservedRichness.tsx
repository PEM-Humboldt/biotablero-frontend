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
    <div className="graphcontainer pt6 overflow-hidden">
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

      <div className="w-full h-full aspect-video">
        {isLoading ? (
          <div className="errorData">Cargando datos...</div>
        ) : (
          <>
            <div>{JSON.stringify(renderData.current, null, 2)}</div>
            <div>{JSON.stringify(renderData.context, null, 2)}</div>
          </>
        )}
      </div>

      <TextBoxes
        consText={texts.observedRichness.cons}
        metoText={texts.observedRichness.meto}
        quoteText={texts.observedRichness.quote}
        downloadData={controller.current.getDownloadData(renderData)}
        downloadName={`cifrasRiquezaObservada_${areaType?.label}_${areaId?.name}.csv`}
        isInfoOpen={showInfoGraph}
        toggleInfo={() => setShowInfoGraph((prev) => !prev)}
      />
    </div>
  );
}
