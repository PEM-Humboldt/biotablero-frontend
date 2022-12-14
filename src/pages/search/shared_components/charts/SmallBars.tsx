import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { AxisTickProps } from "@nivo/axes";

import { darkenColor } from "utils/colorUtils";
import formatNumber from "utils/format";
import withMessageWrapper from "pages/search/shared_components/charts/withMessageWrapper";
import { SmallBarTooltip } from "pages/search/types/charts";
import { Tick } from "pages/search/shared_components/CssTicks";

interface Props {
  data: Array<SmallBarsData>;
  keys: Array<string>;
  tooltips: Array<SmallBarTooltip>;
  height?: number;
  colors: (key: string) => string;
  onClickHandler: (group: string, category: string) => void;
  selectedIndexValue?: string;
  groupMode?: "grouped" | "stacked";
  maxValue?: number | "auto";
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  enableLabel?: boolean;
  axisY?: {
    enabled?: boolean;
    legend?: string;
  };
  axisX?: {
    enabled?: boolean;
    legend?: string;
    format?: string;
    tickValues?: number;
  };
  gridXValues?: number;
  alternateAxisY?: {
    values: Record<string, string>;
    tickWidth?: number;
    tickHeight?: number;
  };
}

export interface SmallBarsDataDetails {
  category: string;
  value: number | string;
}

export interface SmallBarsData {
  group: string;
  data: Array<SmallBarsDataDetails>;
}

interface State {
  selectedIndexValue: string | number;
}

class SmallBars extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { selectedIndexValue = "" } = props;
    this.state = {
      selectedIndexValue: selectedIndexValue,
    };
  }

  render() {
    const {
      data,
      keys,
      tooltips,
      height = 250,
      colors,
      onClickHandler,
      groupMode = "stacked",
      maxValue = "auto",
      enableLabel = false,
      alternateAxisY = { values: {} },
      gridXValues,
    } = this.props;
    let { margin, axisY, axisX } = this.props;
    margin = { ...{ top: 20, right: 15, bottom: 0, left: 90 }, ...margin };
    axisY = { ...{ enabled: false, legend: "" }, ...axisY };
    axisX = {
      ...{ enabled: false, legend: "", format: ".2f", tickValues: undefined },
      ...axisX,
    };
    const { selectedIndexValue } = this.state;

    const transformData = (rawData: Array<SmallBarsData>) => {
      const transformedData = rawData.map((element) => {
        const object: Record<string, string | number> = {
          group: element.group,
        };
        element.data.forEach((item) => {
          object[item.category] = item.value;
        });
        return object;
      });
      return transformedData;
    };

    return (
      <div style={{ height }}>
        <ResponsiveBar
          data={transformData(data)}
          keys={keys}
          indexBy="group"
          layout="horizontal"
          groupMode={groupMode}
          maxValue={maxValue}
          margin={margin}
          padding={0.35}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          enableGridY={false}
          enableGridX
          gridXValues={gridXValues}
          axisLeft={
            axisY.enabled
              ? {
                  tickSize: 3,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: `${axisY.legend}`,
                  legendPosition: "middle",
                  legendOffset: -80,
                  renderTick: CustomTickWrapper(
                    null,
                    alternateAxisY.tickWidth,
                    alternateAxisY.tickHeight,
                    "left",
                    selectedIndexValue
                  ),
                }
              : null
          }
          axisBottom={
            axisX.enabled
              ? {
                  tickSize: 0,
                  tickPadding: 0,
                  tickRotation: 0,
                  tickValues: axisX.tickValues,
                  format: `${axisX.format}`,
                  legend: `${axisX.legend}`,
                  legendPosition: "start",
                  legendOffset: 25,
                }
              : null
          }
          axisRight={
            alternateAxisY && {
              renderTick: CustomTickWrapper(
                alternateAxisY.values,
                alternateAxisY.tickWidth,
                alternateAxisY.tickHeight,
                "right"
              ),
            }
          }
          enableLabel={enableLabel}
          label={({ value }) => (value ? formatNumber(value, 2) : "")}
          colors={({ id, indexValue }) => {
            if (indexValue === selectedIndexValue) {
              return darkenColor(colors(String(id)), 15);
            }
            return colors(String(id));
          }}
          animate
          theme={{
            axis: {
              legend: { text: { fontSize: "14" } },
            },
          }}
          tooltip={({ id, indexValue, color }) => {
            const currentVal = tooltips.find(
              (e) => e.category == id && e.group === indexValue
            );
            const tooltipRows = currentVal
              ? currentVal.tooltipContent.slice(1)
              : [];

            return (
              <div
                className="tooltip-graph-container"
                style={{ position: "absolute" }}
              >
                <strong style={{ color }}>
                  {currentVal ? currentVal.tooltipContent[0] : ""}
                </strong>
                <div style={{ color: "#ffffff" }}>
                  {tooltipRows.map((rowValue, i) => {
                    return (
                      <div key={rowValue}>
                        {rowValue}
                        <br />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
          onClick={({ id, indexValue }) => {
            this.setState({ selectedIndexValue: indexValue });
            onClickHandler(String(indexValue), String(id));
          }}
        />
      </div>
    );
  }
}

export default withMessageWrapper<Props>(SmallBars);

const CustomTickWrapper = (
  refValues: Record<string, string> | null = null,
  tickWidth: number = 90,
  tickHeight: number = 30,
  side: string = "left",
  selected: string | number = ""
) => {
  return (tick: AxisTickProps<string>) => {
    return (
      <g transform={`translate(${tick.x},${tick.y})`}>
        <foreignObject
          x={side === "left" ? -100 : tick.x}
          y={-14}
          width={tickWidth}
          height={tickHeight}
        >
          <Tick side={side} selected={selected === tick.value}>
            {refValues ? refValues[tick.value] : tick.value}
          </Tick>
        </foreignObject>
      </g>
    );
  };
};
