import { ResponsiveBar } from "@nivo/bar";

import formatNumber from "utils/format";
import withMessageWrapper from "pages/search/shared_components/charts/withMessageWrapper";

interface Props {
  data: Array<LargeStackedBarData>;
  height?: number;
  colors: (key: string | number) => string;
  units?: string;
  onClickGraphHandler?: (key: string) => void;
  labelX?: string;
  labelY?: string;
  padding?: number;
}

export interface LargeStackedBarData {
  key: string | number;
  area: number;
  percentage?: number;
  label: string;
}

const darkColors: { [key: string]: string } = {
  "#003d59": "#003d59",
  "#5a1d44": "#5a1d44",
  "#902130": "#902130",
};

const LargeStackedBar = (props: Props) => {
  const {
    data,
    labelX = "",
    labelY = "",
    height = 150,
    colors,
    padding = 0.25,
    units = "ha",
    onClickGraphHandler,
  } = props;

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {array} rawData raw data from RestAPI
   * @param {String} key id for data of each bar o serie
   * @returns {array} transformed data ready to be used by graph component
   */
  const transformData = (rawData: Array<LargeStackedBarData>, key: string) => {
    const transformedData: Record<string, string | number> = {
      key,
    };
    rawData.forEach((item) => {
      transformedData[item.key] = Number(item.area || item.percentage);
      transformedData[`${item.key}Color`] = colors(item.key);
      transformedData[`${item.key}Label`] = item.label;
      transformedData[`${item.key}Percentage`] = Number(item.percentage);
    });
    return [transformedData];
  };

  const keys = data.map((item) => String(item.key));

  /**
   * Get tooltip for graph component
   *
   * @param {String} id id for each bar
   * @param {Object} allData transformed data with all information needed
   * @param {String} color color for each category inside a bar
   * @returns {object} tooltip for component
   */
  const getToolTip = (
    id: string | number,
    allData: Record<string, string | number>,
    color: string
  ) => {
    if (allData[`${id}Percentage`]) {
      return (
        <div className="tooltip-graph-container">
          <strong style={{ color: darkColors[color] ? "#ffffff" : color }}>
            {allData[`${id}Label`]}
          </strong>
          <div style={{ color: "#ffffff" }}>
            {`${formatNumber(allData[id], 0)} ${units}`}
            <br />
            {`${formatNumber(Number(allData[`${id}Percentage`]) * 100, 2)}%`}
          </div>
        </div>
      );
    }
    return (
      <div className="tooltip-graph-container">
        <strong style={{ color: darkColors[color] ? "#ffffff" : color }}>
          {allData[`${id}Label`]}
        </strong>
        <div style={{ color: "#ffffff" }}>
          {`${formatNumber(allData[id], 0)} ${units}`}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={transformData(data, labelY)}
        onClick={(category) => onClickGraphHandler?.(String(category.id))}
        keys={keys}
        indexBy="key"
        layout="horizontal"
        margin={{
          top: 0,
          right: 40,
          bottom: 45,
          left: 40,
        }}
        padding={padding}
        colors={(obj) => colors(String(obj.id))}
        enableGridX
        borderWidth={0}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisLeft={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          format: ".2s",
          legend: labelX,
          legendPosition: "start",
          legendOffset: 25,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate
        tooltip={({ id, data: allData, color }) =>
          getToolTip(id, allData, color)
        }
        theme={{
          axis: { legend: { text: { fontSize: "14" } } },
        }}
      />
    </div>
  );
};

export default withMessageWrapper<Props>(LargeStackedBar);
