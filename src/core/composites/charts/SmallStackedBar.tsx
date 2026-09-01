import { ResponsiveBar } from "@nivo/bar";

import BarItem from "@composites/charts/BarItem";
import { formatNumber } from "@utils/format";
import { withMessageWrapper } from "@composites/charts/withMessageWrapper";

interface Props {
  data: Array<SmallStackedBarData>;
  height?: number;
  colors: (key: string) => string;
  units?: string;
  onClickGraphHandler?: (key: string) => void;
  scaleType?: "linear" | "symlog";
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: number;
  forceFullPercent?: boolean;
}

export interface SmallStackedBarData {
  area: number;
  key: string;
  percentage: number;
  label: string;
}

/**
 * Renders a compact horizontal stacked bar chart to display segment distributions.
 *
 * @param props - The component props.
 * @param props.data - An array of `SmallStackedBarData` objects containing keys, labels, absolute values (`area`), and ratios (`percentage`).
 * @param props.colors - A function returning the CSS color string corresponding to a segment key (`(key: string) => string`).
 * @param props.height - Optional pixel height for the chart container. Defaults to `30`.
 * @param props.units - Optional measurement unit string displayed next to the absolute value in the tooltip. Defaults to `"ha"`.
 * @param props.forceFullPercent - Optional flag to control visual scaling. When `true`, segments scale to fill 100% of the bar, when `false`, segments scale by absolute value. Defaults to `false`. Do not use when working with `symlog`.
 * @param props.scaleType - Optional numerical scale type (`"linear"` | `"symlog"`).
 * @param props.onClickGraphHandler - Optional callback function triggered when clicking a bar segment, receiving the segment `id`.
 * @param props.margin - Optional outer margins for the rendered chart canvas. Defaults to `{ top: 0, right: 5, bottom: 0, left: 5 }`.
 * @param props.padding - Optional bar padding ratio within the canvas. Defaults to `0.19`.
 *
 * @returns A responsive stacked bar chart and optional log scale note.
 *
 * @remarks
 * - Internal data transformation formats values for Nivo's `ResponsiveBar` rendering while retaining unscaled absolute and percentage values for tooltips.
 * - Displays interactive tooltips with formatted absolute numbers and percentage values for non-"NA" segments.
 */
function SmallStackedBar(props: Props) {
  const {
    data,
    height = 30,
    colors,
    units = "ha",
    onClickGraphHandler,
    scaleType = "linear",
    margin = {
      top: 0,
      right: 5,
      bottom: 0,
      left: 5,
    },
    padding = 0.19,
    forceFullPercent = false,
  } = props;

  const transformData = (rawData: Array<SmallStackedBarData>) => {
    const transformedData: Record<string, string | number> = {
      key: "key",
    };

    rawData.forEach((item) => {
      const rawArea = item.area ?? 0;
      const pct = item.percentage ?? 0;

      transformedData[item.key] = forceFullPercent ? pct : rawArea;

      transformedData[`${item.key}Area`] = rawArea;
      transformedData[`${item.key}Percentage`] = pct;
      transformedData[`${item.key}Color`] = colors(item.key);
      transformedData[`${item.key}Label`] = item.label;
    });

    return [transformedData];
  };

  const keys = data.map((item) => String(item.key));

  const getToolTip = (
    id: string | number,
    allData: Record<string, string | number>,
    color: string,
  ) => {
    if (id !== "NA") {
      const realArea = Number(allData[`${id}Area`] ?? 0);
      const pctValue = Number(allData[`${id}Percentage`] ?? 0);

      return (
        <div className="tooltip-graph-container">
          <strong style={{ color }}>
            {id !== "undefined" ? allData[`${id}Label`] : ""}
          </strong>
          <div>
            {`${formatNumber(realArea, 0)} ${units}`}
            <br />
            {`${formatNumber(pctValue, 0)}%`}
          </div>
        </div>
      );
    }
    return <div style={{ display: "none" }} />;
  };

  return (
    <>
      <div style={{ height }}>
        <ResponsiveBar
          data={transformData(data)}
          keys={keys}
          indexBy="key"
          layout="horizontal"
          margin={margin}
          padding={padding}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          colors={({ id, data: allData }) => String(allData[`${id}Color`])}
          enableGridY={false}
          axisLeft={null}
          enableLabel={false}
          animate
          barComponent={BarItem}
          tooltip={({ id, data: allData, color }) =>
            getToolTip(id, allData, color)
          }
          onClick={({ id }) => onClickGraphHandler?.(String(id))}
          valueScale={{ type: scaleType }}
        />
      </div>
      {scaleType === "symlog" && (
        <div className="divergentDataBar">
          *El porcentaje resultante es tan bajo (poner cursor sobre la barra)
          que se usa escala logarítmica
        </div>
      )}
    </>
  );
}

export default withMessageWrapper<Props>(SmallStackedBar);
