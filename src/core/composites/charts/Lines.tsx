import { useState, useEffect } from "react";
import { type Point, ResponsiveLine } from "@nivo/line";
import { type CartesianMarkerProps } from "@nivo/core";

import { formatNumber } from "@utils/format";
import { withMessageWrapper } from "@composites/charts/withMessageWrapper";

interface LinesData {
  label: string;
  data: { y: number; x: string }[];
  key: string;
}

interface SerieData {
  id: string;
  data: { y: number; x: string }[];
  color: string;
}

interface Props {
  colors: (key: string | number) => string;
  seriesData: LinesData[];
  markers?: CartesianMarkerProps[];
  labelX?: string;
  labelY?: string;
  onClickGraphHandler?: (id: string) => void;
  yMin?: number;
  yMax?: number;
  height?: number;
  units?: string;
  showLegend?: boolean;
  enablePoints?: boolean;
}

function LinesGraph({
  seriesData,
  colors,
  units,
  onClickGraphHandler,
  labelX,
  labelY,
  markers,
  yMin = 0,
  yMax = 100,
  height = 490,
  showLegend = true,
  enablePoints = false,
}: Props) {
  const [data, setData] = useState<SerieData[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const newLabels: Record<string, string> = {};
    const newData = seriesData.map((obj) => {
      newLabels[obj.key] = obj.label;
      return { id: obj.key, data: obj.data, color: colors(obj.key) };
    });
    setData(newData);
    setLabels(newLabels);
  }, [seriesData, colors]);

  const changeSelected = (idToSelect: string | number) => {
    const transformedData = seriesData.map((obj) => {
      if (obj.key === idToSelect) {
        return { ...obj, id: obj.key, color: colors(`${obj.key}Sel`) };
      }
      return { ...obj, id: obj.key, color: colors(obj.key) };
    });
    setData(transformedData);
    setSelectedId(String(idToSelect));
  };

  const selectLine = (id: string) => {
    changeSelected(id);
    onClickGraphHandler?.(id);
  };

  const getToolTip = (point: Point<SerieData>) => {
    const {
      data: { xFormatted, yFormatted },
      seriesColor,
      seriesId,
    } = point;

    return (
      <div className="tooltip-graph-container">
        <div>
          <strong style={{ color: seriesColor }}>
            {`${labels[seriesId]} en ${xFormatted}`}
          </strong>
          <br />
          <div>
            {`${formatNumber(yFormatted, 2)}${units ? ` ${units}` : ""}`}
          </div>
        </div>
      </div>
    );
  };

  return !data ? null : (
    <div style={{ height }}>
      <ResponsiveLine
        data={data}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: yMin,
          max: yMax,
          stacked: false,
          reverse: false,
        }}
        margin={{
          top: 10,
          left: 60,
          right: 20,
          bottom: showLegend ? 100 : 50,
        }}
        curve="cardinal"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: labelX,
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: labelY,
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enablePoints={enablePoints}
        pointSize={7}
        pointColor="#ffffff"
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        markers={markers}
        isInteractive
        onClick={(point) => {
          selectLine(String(point.seriesId));
        }}
        tooltip={(point) => getToolTip(point.point)}
        crosshairType="cross"
        colors={(obj) => obj.color}
        areaBlendMode="multiply"
        useMesh={true}
        legends={
          showLegend
            ? [
                {
                  anchor: "bottom-left",
                  data: Object.keys(labels).map((id) => {
                    const color =
                      id === selectedId ? colors(`${id}Sel`) : colors(id);
                    return {
                      id,
                      label: labels[id],
                      color,
                    };
                  }),
                  direction: "row",
                  justify: false,
                  translateX: -50,
                  translateY: 100,
                  itemsSpacing: 5,
                  itemDirection: "left-to-right",
                  itemWidth: 105,
                  itemHeight: 40,
                  itemOpacity: 0.75,
                  onClick: (datum) => {
                    selectLine(String(datum.id));
                  },
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                      },
                    },
                  ],
                },
              ]
            : []
        }
        animate
        pointLabelYOffset={0}
      />
    </div>
  );
}

export const Lines = withMessageWrapper<Props>(LinesGraph);
