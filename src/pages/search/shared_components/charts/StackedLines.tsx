import React from "react";
import { Point, ResponsiveLine } from "@nivo/line";
import { CartesianMarkerProps } from "@nivo/core";

import formatNumber from "utils/format";
import withMessageWrapper from "pages/search/shared_components/charts/withMessageWrapper";

interface StackedLinesData {
  label: string;
  data: Array<{
    y: number;
    x: string;
  }>;
  key: string;
}

interface StackedLinesDataState {
  id: string;
  data: Array<{
    y: number;
    x: string;
  }>;
  color: string;
}

interface Props {
  colors: (key: string | number) => string;
  data: Array<StackedLinesData>;
  markers?: Array<CartesianMarkerProps>;
  labelX?: string;
  labelY?: string;
  onClickGraphHandler?: (id: string) => void;
  yMin?: number;
  yMax?: number;
  height?: number;
  units?: string;
}

interface State {
  data: Array<StackedLinesDataState>;
  labels: Record<string, string>;
  selectedId: string;
}
class StackedLines extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [],
      labels: {},
      selectedId: "",
    };
  }

  componentDidMount() {
    const { data, colors } = this.props;
    const labels: Record<string, string> = {};
    const newData = data.map((obj) => {
      labels[obj.key] = obj.label;
      return { id: obj.key, data: obj.data, color: colors(obj.key) };
    });
    this.setState({
      data: newData,
      labels,
    });
  }

  /**
   * Organize customized tooltip for this graph
   *
   * @param {object} point datum selected in the graph
   */
  getToolTip = (point: Point) => {
    const {
      data: { xFormatted, yFormatted },
      serieColor,
      serieId,
    } = point;
    const { labels } = this.state;
    const { units } = this.props;
    return (
      <div className="tooltip-graph-container">
        <div>
          <strong
            style={{ color: serieId === "aTotal" ? "#ffffff" : serieColor }}
          >
            {`${labels[serieId]} en ${xFormatted}`}
          </strong>
          <br />
          <div style={{ color: "#ffffff" }}>
            {`${formatNumber(yFormatted, 2)}${units ? ` ${units}` : ""}`}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Set state values updated by user action with the data structure required
   *
   * @param {string} selectedId identify the value selected in data
   */
  changeSelected = (selectedId: string | number) => {
    const { data, colors } = this.props;
    const transformedData = data.map((obj) => {
      // "id" field is required for NIVO Line component
      if (obj.key === selectedId)
        return { ...obj, id: obj.key, color: colors(`${obj.key}Sel`) };
      return { ...obj, id: obj.key, color: colors(obj.key) };
    });
    this.setState({ data: transformedData, selectedId: String(selectedId) });
  };

  /**
   * Handle events to be updated when a line in the graph is selected
   *
   * @param {object} point retrieve the datum selected in the graph
   */
  selectLine = (id: string) => {
    const { onClickGraphHandler } = this.props;
    this.changeSelected(id);
    onClickGraphHandler?.(id);
  };

  render() {
    const {
      labelX,
      labelY,
      markers,
      colors,
      yMin = 0,
      yMax = 100,
      height = 490,
    } = this.props;

    const { data, labels, selectedId } = this.state;

    if (!data) return null;

    return (
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
            top: 50,
            left: 60,
            right: 20,
            bottom: 100,
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
          enablePoints
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          markers={markers}
          isInteractive
          onClick={(point) => {
            this.selectLine(String(point.serieId));
          }}
          tooltip={(point) => this.getToolTip(point.point)}
          crosshairType="cross"
          colors={(obj) => obj.color}
          areaBlendMode="multiply"
          useMesh={true}
          legends={[
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
                this.selectLine(String(datum.id));
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
          ]}
          animate
          pointLabelYOffset={0}
        />
      </div>
    );
  }
}

export default withMessageWrapper<Props>(StackedLines);
