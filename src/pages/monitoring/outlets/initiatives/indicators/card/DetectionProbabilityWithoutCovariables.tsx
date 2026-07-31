import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { ResponsiveLine } from "@nivo/line";
import {
  GRAPH_ANIMATION_CONFIG,
  GRAPHS_EXTENDED_COLOR_PALETTE,
} from "@config/monitoring";
import { Combobox } from "@ui/ComboBox";
import { cn } from "@ui/shadCN/lib/utils";
import { hashStringToRange } from "@utils/format";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { ConfidenceIntervalLayer } from "pages/monitoring/outlets/initiatives/indicators/card/utils/ConfidenceIntervalLayer";
import type { LineData } from "pages/monitoring/types/indicators";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";
import { BarsLegend } from "pages/monitoring/outlets/initiatives/indicators/card/ui/BarsLegend";
import { getSeriesColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";
import { GetIndicatorInfo } from "@hooks/useReport/GetIndicatorInfo";

const customColorMap: Record<string, string> = {
  "Probabilidad de detección": GRAPHS_EXTENDED_COLOR_PALETTE[2],
  "Probabilidad de ocupación": GRAPHS_EXTENDED_COLOR_PALETTE[22],
};

export function DetectionProbabilityWithoutCovariables() {
  const { currentIndicator } = useIndicatorsCTX();
  const [selectedSpecie, setSelectedSpecie] = useState<string>("");

  const speciesOptions = useMemo(
    () =>
      (currentIndicator?.groups ?? []).map((group) => {
        const commonName = group.category?.description
          ? `${group.category?.description}, `
          : "";
        return {
          value: group.category.name,
          label: `${commonName}${group.category.name}`,
        };
      }),
    [currentIndicator?.groups],
  );

  const { renderIndicatorInfo, keys } = useMemo(() => {
    if (!currentIndicator) {
      return { renderIndicatorInfo: [], keys: [] };
    }

    const renderIndicatorInfo: (LineData & { id: string })[] = [];
    const keys: string[] = [];

    ((currentIndicator.cleanData ?? []) as LineData[]).forEach((serie) => {
      const key = serie.metricName || serie.id;
      renderIndicatorInfo.push({ ...serie, id: key });
      keys.push(key);
    });

    return { renderIndicatorInfo, keys };
  }, [currentIndicator]);

  const filteredData = useMemo(
    () =>
      renderIndicatorInfo.filter(
        (serie) => serie.scientificName === selectedSpecie,
      ),
    [renderIndicatorInfo, selectedSpecie],
  );

  const selectedSpecieTitle = useMemo(() => {
    const current = currentIndicator?.groups.find(
      (specie) => specie.category.name === selectedSpecie,
    );

    return current
      ? {
          name: current.category.name,
          commonName: current.category.description,
        }
      : { name: undefined, commonName: undefined };
  }, [currentIndicator?.groups, selectedSpecie]);

  useEffect(() => {
    if (!currentIndicator) {
      return;
    }

    setSelectedSpecie(speciesOptions[0].value ?? "");
  }, [currentIndicator, speciesOptions]);

  return !currentIndicator ? null : (
    <>
      <div className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300">
        {speciesOptions.length > 1 && (
          <Combobox
            items={speciesOptions ?? []}
            value={selectedSpecie}
            setValue={setSelectedSpecie}
            uiText={uiText.indicatorCard.detectionProbabilityWCov.selector}
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

      <GetIndicatorInfo
        graphId={
          selectedSpecieTitle.commonName
            ? `${selectedSpecieTitle.commonName}, ${selectedSpecieTitle.name}`
            : (selectedSpecieTitle.name ?? "")
        }
        mapUrl={null}
        mapElementId={null}
      >
        <>
          <div className="w-full h-full aspect-3/2">
            <ResponsiveLine
              data={filteredData}
              margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: 0,
                max: 1,
              }}
              motionConfig={GRAPH_ANIMATION_CONFIG}
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
                            {uiText.indicatorCard.rangedTooltip.upperLimitTitle}
                          </td>
                          <td>{point.data?.upperLimit ?? data}</td>
                        </tr>
                        <tr>
                          <td>Índice</td>
                          <td>{data}</td>
                        </tr>
                        <tr>
                          <td>
                            {uiText.indicatorCard.rangedTooltip.lowerLimitTitle}
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

          <BarsLegend keys={keys} customColorMap={customColorMap} />
        </>
      </GetIndicatorInfo>
    </>
  );
}
