import React from "react";
import { ResponsiveBar, BarSvgProps, BarDatum } from "@nivo/bar";
import { darkenColor } from "utils/colorUtils";
import formatNumber from "utils/format";
import withMessageWrapper from "pages/search/shared_components/charts/withMessageWrapper";

interface Props extends Partial<Omit<BarSvgProps<BarDatum>, "colors">> {
  data: Array<BarDatum>;
  height?: number;
  colors: (key: string) => string;
  onClickHandler: (
    period?: string,
    key?: string,
    selected?: string | undefined
  ) => void;
  selectedIndexValue?: string;
}

interface State {
  selectedIndexValue: string;
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
      indexBy = "id",
      margin,
      padding,
      height = 500,
      colors,
      layout = "horizontal",
      groupMode = "stacked",
      axisTop = null,
      axisRight = null,
      axisBottom = null,
      axisLeft = null,
      enableLabel = false,
      enableGridX = false,
      enableGridY = false,
      onClickHandler,
      tooltip = undefined,
    } = this.props;
    const { selectedIndexValue } = this.state;

    return (
      <div style={{ height }}>
        <ResponsiveBar
          data={data}
          keys={keys}
          margin={margin}
          indexBy={indexBy}
          layout={layout}
          groupMode={groupMode}
          padding={padding}
          axisTop={axisTop}
          axisRight={axisRight}
          axisBottom={axisBottom}
          axisLeft={axisLeft}
          enableLabel={enableLabel}
          enableGridX={enableGridX}
          enableGridY={enableGridY}
          label={({ value }) => (value ? formatNumber(value, 2) : "")}
          animate
          theme={{
            axis: {
              legend: { text: { fontSize: "14" } },
            },
          }}
          colors={({ id, indexValue }) => {
            if (indexValue === selectedIndexValue) {
              return darkenColor(colors(String(id)), 15);
            }
            return colors(String(id));
          }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          onClick={({ indexValue }) => {
            this.setState({ selectedIndexValue: String(indexValue) });
            onClickHandler(String(indexValue));
          }}
          tooltip={tooltip}
        />
      </div>
    );
  }
}

export default withMessageWrapper<Props>(SmallBars);
