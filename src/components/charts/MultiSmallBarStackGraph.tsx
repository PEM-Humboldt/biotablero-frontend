import React from "react";
import { ResponsiveBar } from "@nivo/bar";

import { darkenColor } from "utils/colorUtils";
import formatNumber from "utils/format";

// TODO: Maybe colors and onClickHandler types should be shared among various charts
interface Props {
  data: Array<MultiSmallBarStackGraphData>;
  height?: number;
  colors: (key: string) => string;
  units?: string;
  onClickHandler: (period: string, key: string) => void;
  selectedIndexValue: string;
}

export interface MultiSmallBarStackGraphData {
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

class MultiSmallBarStackGraph extends React.Component<Props, State> {
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
      units = "ha",
      onClickHandler,
    } = this.props;
    const { selectedIndexValue } = this.state;

    /**
     * Transform data structure to be passed to component as a prop
     *
     * @param {array} rawData raw data from RestAPI
     * @returns {array} transformed data ready to be used by graph component
     */
    const transformData = (rawData: Array<MultiSmallBarStackGraphData>) => {
      const transformedData = rawData.map((element) => {
        const object: Record<string, string | number> = {
          key: element.id,
        };
        element.data.forEach((item) => {
          object[item.key] = item.area;
          object[`${item.key}Color`] = colors(item.key);
          object[`${item.key}DarkenColor`] = darkenColor(colors(item.key), 15);
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
          margin={{
            top: 20,
            right: 15,
            bottom: 50,
            left: 90,
          }}
          padding={0.35}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          colors={({ id, indexValue, data: allData }) => {
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
            legend: "Periodo",
            legendPosition: "middle",
            legendOffset: -80,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 0,
            tickRotation: 0,
            format: ".2s",
            legend: "Hectáreas",
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
                {`${formatNumber(allData[id], 0)} ${units}`}
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

export default MultiSmallBarStackGraph;
