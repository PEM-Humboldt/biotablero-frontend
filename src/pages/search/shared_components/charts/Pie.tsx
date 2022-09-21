import { ResponsivePie } from "@nivo/pie";
import React from "react";

import formatNumber from "utils/format";
import { lightenColor, darkenColor } from "utils/colorUtils";
import withMessageWrapper from "./withMessageWrapper";

interface Props {
  data: Array<PieData>;
  height?: number;
  colors: (key: string) => string;
  units?: string;
  onClickHandler: (section: string) => void;
}

export interface PieData {
  id: string;
  label: string;
  value: number;
}

interface State {
  selectedId: string | null;
}

class Pie extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedId: null,
    };
  }

  render() {
    const {
      height = 450,
      units = "ha",
      onClickHandler,
      colors,
      data,
    } = this.props;
    const { selectedId } = this.state;
    return (
      <div style={{ height }}>
        <ResponsivePie
          data={data}
          colors={({ id }) => {
            if (selectedId === id) {
              return darkenColor(colors(id), 10);
            }
            return colors(String(id));
          }}
          margin={{ top: 30, bottom: 30 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.5]] }}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          tooltip={({ datum: { label, value, color } }) => (
            <div className="tooltip-graph-container">
              <strong style={{ color: lightenColor(color, 15) }}>
                {`${label}:`}
              </strong>
              <div>
                {formatNumber(value, 2)}
                {` ${units}`}
              </div>
            </div>
          )}
          onClick={({ id }) => {
            this.setState({ selectedId: String(id) });
            onClickHandler(String(id));
          }}
        />
      </div>
    );
  }
}

export default withMessageWrapper<Props>(Pie);
