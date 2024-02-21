import { ResponsiveBar } from "@nivo/bar";

import BarItem from "pages/search/shared_components/charts/BarItem";
import formatNumber from "utils/format";
import withMessageWrapper from "./withMessageWrapper";

interface Props {
  data: Array<SmallStackedBarData>;
  height?: number;
  colors: (key: string) => string;
  units?: string;
  onClickGraphHandler?: (key: string) => void;
  scaleType?: "linear" | "symlog";
}

export interface SmallStackedBarData {
  area: number;
  key: string;
  percentage: number;
  label: string;
}

const SmallStackedBar = (props: Props) => {
  const {
    data,
    height = 30,
    colors,
    units = "ha",
    onClickGraphHandler,
    scaleType = "linear",
  } = props;

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {array} rawData raw data from RestAPI
   * @returns {array} transformed data ready to be used by graph component
   */
  const transformData = (rawData: Array<SmallStackedBarData>) => {
    const transformedData: Record<string, string | number> = {
      key: "key",
    };
    rawData.forEach((item) => {
      transformedData[item.key] = Number(item.area || item.percentage);
      transformedData[`${item.key}Color`] = colors(item.key);
      transformedData[`${item.key}Label`] = item.label;
      if (item.percentage) {
        transformedData[`${item.key}Percentage`] = Number(item.percentage);
      }
    });
    return [transformedData];
  };

  /**
   * Get keys to be passed to component as a prop
   *
   * @returns {array} ids of each bar
   */
  const keys = data.map((item) => String(item.key));

  /**
   * Get tooltip for graph component according to id of bar
   *
   * @param {string} id id for each bar
   * @param {Object} allData transformed data with all information needed
   *
   * @returns {object} tooltip for component
   */
  const getToolTip = (
    id: string | number,
    allData: Record<string, string | number>
  ) => {
    if (id !== "NA") {
      return (
        <div className="tooltip-graph-container">
          <strong style={{ color: "#e84a5f" }}>
            {id !== "undefined" ? allData[`${id}Label`] : ""}
          </strong>
          <div>
            {`${formatNumber(allData[id], 0)} ${units}`}
            <br />
            {`${formatNumber(Number(allData[`${id}Percentage`]) * 100, 0)}%`}
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
          margin={{
            top: 0,
            right: 5,
            bottom: 0,
            left: 5,
          }}
          padding={0.19}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          colors={({ id, data: allData }) => String(allData[`${id}Color`])}
          enableGridY={false}
          axisLeft={null}
          enableLabel={false}
          animate
          barComponent={BarItem}
          tooltip={({ id, data: allData }) => getToolTip(id, allData)}
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
};

export default withMessageWrapper<Props>(SmallStackedBar);
