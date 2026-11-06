import { useEffect, useMemo, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

import { GRAPHS_CONTRAST_COLOR_PALETTE } from "@config/color";
import { GRAPH_ANIMATION_CONFIG } from "@config/global";
import { TOPIC_OCUPATION_SPECIES_MAX_COUNT } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";
import { GetTopicInfo } from "@hooks/useReport/GetTopicInfo";
import { hashStringToRange } from "@utils/format";

import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";
import type { LineData } from "pages/monitoring/types/topics";
import { getSeriesColor } from "pages/monitoring/outlets/initiatives/topics/card/utils/colors";
import { uiText } from "pages/monitoring/outlets/initiatives/topics/layout/uiText";
import { GraphLegend } from "@ui/GraphLegend";

export function OccupationSpecies() {
  const { currentTopic } = useTopicsCTX();
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const speciesOptions = useMemo(
    () =>
      (currentTopic?.groups ?? []).map((group) => ({
        commonName: group.category.description,
        name: group.category.name,
        color: getSeriesColor(
          hashStringToRange(
            `${group.category.description}, ${group.category.name}`,
          ),
          GRAPHS_CONTRAST_COLOR_PALETTE,
        ),
      })),
    [currentTopic?.groups],
  );

  const renderTopicInfo = useMemo(() => {
    if (!currentTopic) {
      return [];
    }

    const rawSeries = (currentTopic.cleanData ?? []) as LineData[];

    return rawSeries.map((line) => {
      const matchedGroup = currentTopic.groups.find(
        (g) => g.category.name === line.scientificName,
      );

      const color = matchedGroup
        ? getSeriesColor(
            hashStringToRange(`${line.commonName}, ${line.scientificName}`),
            GRAPHS_CONTRAST_COLOR_PALETTE,
          )
        : "#FF0000";

      return { ...line, color };
    });
  }, [currentTopic]);

  const filteredTopic = useMemo(
    () =>
      renderTopicInfo.filter((i) => selectedSpecies.includes(i.scientificName)),
    [renderTopicInfo, selectedSpecies],
  );

  const handleSelect = (item: string) => {
    if (selectedSpecies.includes(item)) {
      setSelectedSpecies((oldList) => oldList.filter((l) => l !== item));
      return;
    }

    setSelectedSpecies((oldList) => {
      const newList = [...oldList, item];
      if (newList.length > TOPIC_OCUPATION_SPECIES_MAX_COUNT) {
        newList.shift();
      }
      return newList;
    });
  };

  useEffect(() => {
    if (!currentTopic) {
      return;
    }

    setSelectedSpecies(() => {
      const loadSpecies: string[] = [];
      for (const specie of currentTopic.groups) {
        if (loadSpecies.length === TOPIC_OCUPATION_SPECIES_MAX_COUNT) {
          break;
        }

        loadSpecies.push(specie.category.name);
      }
      return loadSpecies;
    });
  }, [currentTopic]);

  return !currentTopic ? null : (
    <>
      <div
        className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300"
        title={uiText.topicCard.ocupationSpecies.title}
      >
        {currentTopic.groups.length > TOPIC_OCUPATION_SPECIES_MAX_COUNT && (
          <span className="italic text-sm text-primary">
            {uiText.topicCard.ocupationSpecies.maxSelection(
              TOPIC_OCUPATION_SPECIES_MAX_COUNT,
            )}
          </span>
        )}
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
          {speciesOptions.map((specie) => {
            const isSelected = selectedSpecies.includes(specie.name);

            return (
              <li key={`selectorBtn_${specie.name}`}>
                <button
                  style={{
                    background: specie.color,
                    borderColor: specie.color,
                  }}
                  className={cn(
                    "text-background w-full min-w-[150px] flex-[1_0] px-2 py-1 flex gap-1 border rounded-lg transition-colors duration-300 hover:cursor-pointer",
                    isSelected ? "" : "text-foreground bg-background!",
                  )}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(specie.name)}
                >
                  <div className="flex flex-col text-left *:m-0">
                    <span className="text-base font-normal">
                      {specie.commonName}
                    </span>
                    <span className="text-sm italic">{specie.name}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <GetTopicInfo
        graphId={selectedSpecies.toSorted().join(", ")}
        mapElementId={null}
        mapUrl={null}
      >
        <>
          <div className="w-full h-full aspect-video">
            <ResponsiveLine
              data={filteredTopic}
              margin={{ top: 20, right: 40, bottom: 30, left: 40 }}
              motionConfig={GRAPH_ANIMATION_CONFIG}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: 0, max: 100 }}
              axisBottom={{ tickSize: 5, legendPosition: "middle" }}
              axisLeft={{ tickSize: 5, legendPosition: "middle" }}
              colors={(series) => series.color}
              pointSize={10}
              useMesh={true}
              tooltip={({ point }) => {
                const [name, description] = point.seriesId
                  .replace(/\|\|.*$/, "")
                  .split(", ");

                return (
                  <div
                    className="bg-background px-4 py-2 shadow-md rounded flex flex-col items-center"
                    style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
                  >
                    <div className="flex flex-col text-center text-sm mb-1 *:m-0!">
                      <div className="space-x-1">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: point.color }}
                        />
                        <span className="font-normal">{description}</span>
                      </div>
                      <span className="italic">{name}</span>
                    </div>
                    <div className="space-x-1">
                      <span className="font-normal">{point.data.y}</span>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          <GraphLegend
            keys={filteredTopic.map(
              (i) => `${i.commonName}, ${i.scientificName}`,
            )}
            customColorList={GRAPHS_CONTRAST_COLOR_PALETTE}
            isBar={false}
            labelClassName={{ complement: "italic" }}
          />
        </>
      </GetTopicInfo>
    </>
  );
}
