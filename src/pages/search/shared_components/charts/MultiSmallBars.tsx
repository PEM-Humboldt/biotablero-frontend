import React from "react";
import { ResponsiveBar } from "@nivo/bar";

import { darkenColor } from "utils/colorUtils";
import formatNumber from "utils/format";
import withMessageWrapper from "pages/search/shared_components/charts/withMessageWrapper";

interface Props {
  data: Array<MultiSmallBarsData>;
  height?: number;
  colors: (key: string) => string;
  groupMode?: "grouped" | "stacked";
  units?: string;
  onClickHandler: (period: string, key: string) => void;
  selectedIndexValue: string;
  toolTipValue?: string;
  axisLeftLegend?: string;
  axisBottomLegend?: string;
  innerPadding?: number;
}

export interface MultiSmallBarsData {
  id: string;
  data: Array<{
    area: number;
    key: string;
    percentage: number;
    label: string;
  }>;
}

interface State {
  selectedIndexValue: string | number;
}

class MultiSmallBars extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedIndexValue: props.selectedIndexValue,
    };
  }

  render() {
    const {
      data,
      height = 250,
      colors,
      axisLeftLegend = "",
      axisBottomLegend = "",
      groupMode = "stacked",
      units = "ha",
      toolTipValue,
      innerPadding = 0,
      onClickHandler,
    } = this.props;
    const { selectedIndexValue } = this.state;

    /**
     * Transform data structure to be passed to component as a prop
     *
     * @param {array} rawData raw data from RestAPI
     * @returns {array} transformed data ready to be used by graph component
     */
    const transformData = (rawData: Array<MultiSmallBarsData>) => {
      const transformedData = rawData.map((element) => {
        const object: Record<string, string | number> = {
          key: element.id,
        };
        element.data.forEach((item) => {
          object[item.key] = item.area;
          object[`${item.key}Label`] = item.label;
          object[`${item.key}Percentage`] = item.percentage;
        });
        return object;
      });
      return transformedData;
    };

    /**
     * Get keys to be passed to component as a prop
     *
     * @returns {array} ids of each bar category
     */
    const keys = data[0] ? data[0].data.map((item) => String(item.key)) : [];

    return (
      <div style={{ height }}>
        <ResponsiveBar
          data={transformData(data)}
          keys={keys}
          indexBy="key"
          layout="horizontal"
          groupMode={groupMode}
          margin={{
            top: 20,
            right: 15,
            bottom: 50,
            left: 90,
          }}
          innerPadding={innerPadding}
          padding={0.35}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          colors={({ id, indexValue }) => {
            if (indexValue === selectedIndexValue) {
              return darkenColor(colors(String(id)), 15);
            }
            return colors(String(id));
          }}
          enableGridY={false}
          enableGridX
          axisLeft={{
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: `${axisLeftLegend}`,
            legendPosition: "middle",
            legendOffset: -80,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 0,
            tickRotation: 0,
            format: ".2s",
            legend: `${axisBottomLegend}`,
            legendPosition: "start",
            legendOffset: 25,
          }}
          enableLabel={false}
          animate
          tooltip={({ id, data: allData, color }) => (
            <div
              className="tooltip-graph-container"
              style={{ position: "absolute" }}
            >
              <strong style={{ color }}>{allData[`${id}Label`]}</strong>
              <div style={{ color: "#ffffff" }}>
                {`${formatNumber(
                  toolTipValue === "percentage"
                    ? allData[`${id}Percentage`]
                    : allData[id],
                  0
                )} ${units}`}
              </div>
            </div>
          )}
          theme={{
            axis: {
              legend: { text: { fontSize: "14" } },
            },
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

export default withMessageWrapper<Props>(MultiSmallBars);
