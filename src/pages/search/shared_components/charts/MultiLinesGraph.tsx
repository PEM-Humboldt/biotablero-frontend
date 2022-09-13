import React from "react";
import { Point, ResponsiveLine } from "@nivo/line";
import { CartesianMarkerProps } from "@nivo/core";

import formatNumber from "utils/format";
import withMessageWrapper from "pages/search/shared_components/charts/withMessageWrapper";

interface MultiLinesGraphData {
  label: string;
  data: Array<{
    y: number;
    x: string;
  }>;
  key: string;
}

interface MultiLinesGraphDataExt extends MultiLinesGraphData {
  id: string;
  color: string;
}

interface Props {
  colors: (key: string | number) => string;
  data: Array<MultiLinesGraphData>;
  markers?: Array<CartesianMarkerProps>;
  labelX: string;
  labelY: string;
  onClickGraphHandler?: (id: string) => void;
  yMin: number;
  yMax: number;
  height?: number;
  units?: string;
}

type LabelType = Record<string, string>;

interface State {
  data: Array<MultiLinesGraphDataExt>;
  labels: LabelType;
  selectedId: string;
}
class MultiLinesGraph extends React.Component<Props, State> {
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
    const labels: LabelType = {};
    const newData = data.map((obj) => {
      labels[obj.key] = obj.label;
      // "id" field is required for NIVO Line component
      return { ...obj, id: obj.key, color: colors(obj.key) };
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
            {`${formatNumber(yFormatted, 2)} ${units}`}
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
    const { labelX, labelY, markers, yMin, yMax, height = 490 } = this.props;

    const { data } = this.state;

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
          theme={{}}
          axisTop={null}
          axisRight={null}
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
          onClick={(point: Point, event: React.MouseEvent) => {
            this.selectLine(String(point.serieId));
          }}
          tooltip={(point) => this.getToolTip(point.point)}
          crosshairType="cross"
          colors={(obj) => obj.color}
          enablePointLabel={true}
          pointLabel="y"
          pointLabelYOffset={-12}
          areaBlendMode="multiply"
          useMesh={true}
          animate
        />
      </div>
    );
  }
}

export default withMessageWrapper<Props>(MultiLinesGraph);
