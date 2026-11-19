import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { ResponsiveLine } from "@nivo/line";
import { GRAPH_ANIMATION_CONFIG } from "@config/global";
import { GRAPHS_EXTENDED_COLOR_PALETTE } from "@config/color";
import { Combobox } from "@ui/ComboBox";
import { cn } from "@ui/shadCN/lib/utils";
import { hashStringToRange } from "@utils/format";
import { GetTopicInfo } from "@hooks/useReport/GetTopicInfo";

import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";
import { ConfidenceIntervalLayer } from "pages/monitoring/outlets/initiatives/topics/card/utils/ConfidenceIntervalLayer";
import type { LineData } from "pages/monitoring/types/topics";
import { uiText } from "pages/monitoring/outlets/initiatives/topics/layout/uiText";
import { GraphLegend } from "@ui/GraphLegend";
import { getSeriesColor } from "pages/monitoring/outlets/initiatives/topics/card/utils/colors";

const customColorMap: Record<string, string> = {
  "Probabilidad de detección": GRAPHS_EXTENDED_COLOR_PALETTE[2],
  "Probabilidad de ocupación": GRAPHS_EXTENDED_COLOR_PALETTE[22],
};

export function DetectionProbabilityWithoutCovariables() {
  const { currentTopic } = useTopicsCTX();
  const [selectedSpecie, setSelectedSpecie] = useState<string>("");

  const speciesOptions = useMemo(
    () =>
      (currentTopic?.groups ?? []).map((group) => {
        const commonName = group.category?.description
          ? `${group.category?.description}, `
          : "";
        return {
          value: group.category.name,
          label: `${commonName}${group.category.name}`,
        };
      }),
    [currentTopic?.groups],
  );

  const { renderTopicInfo, keys } = useMemo(() => {
    if (!currentTopic) {
      return { renderTopicInfo: [], keys: [] };
    }

    const renderTopicInfo: (LineData & { id: string })[] = [];
    const keys: string[] = [];

    ((currentTopic.cleanData ?? []) as LineData[]).forEach((serie) => {
      const key = serie.metricName || serie.id;
      renderTopicInfo.push({ ...serie, id: key });
      keys.push(key);
    });

    return { renderTopicInfo, keys };
  }, [currentTopic]);

  const filteredData = useMemo(
    () =>
      renderTopicInfo.filter(
        (serie) => serie.scientificName === selectedSpecie,
      ),
    [renderTopicInfo, selectedSpecie],
  );

  const selectedSpecieTitle = useMemo(() => {
    const current = currentTopic?.groups.find(
      (specie) => specie.category.name === selectedSpecie,
    );

    return current
      ? {
          name: current.category.name,
          commonName: current.category.description,
        }
      : { name: undefined, commonName: undefined };
  }, [currentTopic?.groups, selectedSpecie]);

  useEffect(() => {
    if (!currentTopic) {
      return;
    }

    setSelectedSpecie(speciesOptions[0].value ?? "");
  }, [currentTopic, speciesOptions]);

  return !currentTopic ? null : (
    <>
      <div className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300">
        {speciesOptions.length > 1 && (
          <Combobox
            items={speciesOptions ?? []}
            value={selectedSpecie}
            setValue={setSelectedSpecie}
            uiText={uiText.topicCard.detectionProbabilityWCov.selector}
            icon={SearchIcon}
            keys={{ forLabel: "label", forValue: "value" }}
          />
        )}

        <h4
          className={cn(
            speciesOptions.length > 1
              ? "border-t border-muted m-0! mt-4 pt-4"
              : "m-0!",
            "text-primary",
          )}
        >
          <div>
            {selectedSpecieTitle?.commonName ?? selectedSpecieTitle.name}
          </div>
          {selectedSpecieTitle?.commonName && (
            <div className="text-base italic font-light">
              {selectedSpecieTitle.name}
            </div>
          )}
        </h4>
      </div>

      <GetTopicInfo
        graphId={
          selectedSpecieTitle.commonName
            ? `${selectedSpecieTitle.commonName}, ${selectedSpecieTitle.name}`
            : (selectedSpecieTitle.name ?? "")
        }
        mapUrl={null}
        mapElementId={null}
      >
        <>
          <div className="w-full h-full aspect-video">
            <ResponsiveLine
              data={filteredData}
              margin={{ top: 20, right: 40, bottom: 30, left: 40 }}
              motionConfig={GRAPH_ANIMATION_CONFIG}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: 0,
                max: 1,
              }}
              colors={(serie) =>
                customColorMap[serie.id] ??
                getSeriesColor(
                  hashStringToRange(
                    String(serie.id),
                    GRAPHS_EXTENDED_COLOR_PALETTE.length,
                  ),
                  GRAPHS_EXTENDED_COLOR_PALETTE,
                )
              }
              pointSize={10}
              useMesh={true}
              layers={[
                "grid",
                "axes",
                ConfidenceIntervalLayer,
                "crosshair",
                "lines",
                "points",
                "mesh",
                "legends",
              ]}
              tooltip={({ point }) => {
                const [name] = point.seriesId
                  .replace(/\|\|.*$/, "")
                  .split(", ");

                const data = point.data.y;
                const date = point.data.x;

                return (
                  <div
                    className="bg-background px-4 py-2 shadow-md rounded flex flex-col items-center"
                    style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
                  >
                    <div className="flex flex-col text-center text-sm mb-1 *:m-0!">
                      <span className="font-normal">
                        <span
                          className="inline-block w-3 h-3 mr-1 rounded-full"
                          style={{ backgroundColor: point.seriesColor }}
                        />
                        {name}
                      </span>
                      <span className="italic">{date}</span>
                    </div>

                    <table className="space-x-1 [&_td]:px-2 [&_tr_td]:first:text-right">
                      <tbody>
                        <tr>
                          <td>
                            {uiText.topicCard.rangedTooltip.upperLimitTitle}
                          </td>
                          <td>{point.data?.upperLimit ?? data}</td>
                        </tr>
                        <tr>
                          <td>Índice</td>
                          <td>{data}</td>
                        </tr>
                        <tr>
                          <td>
                            {uiText.topicCard.rangedTooltip.lowerLimitTitle}
                          </td>
                          <td>{point.data?.lowerLimit ?? data}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              }}
            />
          </div>

          <GraphLegend
            keys={keys}
            customColorMap={customColorMap}
            isBar={false}
          />
        </>
      </GetTopicInfo>
    </>
  );
}
