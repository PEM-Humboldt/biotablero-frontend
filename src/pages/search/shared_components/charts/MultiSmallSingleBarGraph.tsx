import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { darkenColor } from "utils/colorUtils";
import formatNumber from "utils/format";
import withMessageWrapper from "./withMessageWrapper";

interface Props {
  data: Array<MultiSmallSingleBarGraphData>;
  height?: number;
  colors: (key: string) => string;
  units?: string;
  onClickHandler: (key: string) => void;
  selectedIndexValue?: string;
  labelX: string;
}

export interface MultiSmallSingleBarGraphData {
  id: string;
  name: string;
  key: string;
  value: number;
  area: number;
}

interface State {
  selectedIndexValue: string;
}

class MultiSmallSingleBarGraph extends React.Component<Props, State> {
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
      height = 250,
      colors,
      units = "ha",
      onClickHandler,
      labelX,
    } = this.props;
    const { selectedIndexValue } = this.state;

    const transformData = (rawData: Array<MultiSmallSingleBarGraphData>) => {
      const transformedData = rawData.map((element) => {
        const object: Record<string, string | number> = {
          id: String(element.id),
        };
        object[String(element.id)] = Number(element.value);
        object[`${String(element.id)}Label`] = element.name;
        object[`${String(element.id)}Color`] = colors(element.key);
        object[`${String(element.id)}DarkenColor`] = darkenColor(
          colors(element.key),
          15
        );
        object[`${String(element.id)}Area`] = Number(element.area);
        return object;
      });
      return transformedData;
    };

    /**
     * Get keys to be passed to component as a prop
     *
     * @returns {array} ids of each bar category removing duplicates
     */
    const keys = data ? [...new Set(data.map((item) => String(item.id)))] : [];

    return (
      <div style={{ height }}>
        <ResponsiveBar
          data={transformData(data)}
          keys={keys}
          indexBy="id"
          layout="horizontal"
          margin={{
            top: 20,
            right: 15,
            bottom: 50,
            left: 40,
          }}
          padding={0.35}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          colors={({ id, indexValue, data: allData }) => {
            if (indexValue === selectedIndexValue) {
              return String(allData[`${id}DarkenColor`]);
            }
            return String(allData[`${id}Color`]);
          }}
          enableGridY={false}
          enableGridX
          axisLeft={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 0,
            tickRotation: 0,
            format: ".2f",
            legend: labelX,
            legendPosition: "start",
            legendOffset: 25,
          }}
          enableLabel
          label={({ value }) => (value ? formatNumber(value, 2) : "")}
          animate
          tooltip={({ id, data: allData, color }) => (
            <div
              className="tooltip-graph-container"
              style={{ position: "absolute" }}
            >
              <strong style={{ color }}>{allData[`${id}Label`]}</strong>
              <div style={{ color: "#ffffff" }}>
                {formatNumber(allData[id], 2)}
                <br />
                {`${formatNumber(allData[`${id}Area`], 2)} ${units}`}
              </div>
            </div>
          )}
          theme={{
            axis: {
              legend: { text: { fontSize: "14" } },
            },
          }}
          onClick={({ indexValue }) => {
            this.setState({ selectedIndexValue: String(indexValue) });
            onClickHandler(String(indexValue));
          }}
        />
      </div>
    );
  }
}

export default withMessageWrapper<Props>(MultiSmallSingleBarGraph);
