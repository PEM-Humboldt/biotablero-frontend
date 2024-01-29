import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { useState } from "react";

interface DataJsonTypes {
  affected_natural: string;
  affected_percentage: string;
  affected_secondary: string;
  affected_transformed: string;
  biome_id: number;
  fc: string;
  id: number;
  name: string;
  total_compensate: string;
}

interface ScatterProps {
  dataJSON: Array<DataJsonTypes>;
  labelX: string;
  labelY: string;
  colors: Array<string>;
  elementOnClick: (key: string) => void;
}

interface DataTypes {
  x: string;
  y: string;
  z: string;
  biome: string;
}

interface DataListTypes {
  id: string;
  data: Array<DataTypes>;
}

export const DotsScatterPlot: React.FC<ScatterProps> = ({
  dataJSON,
  labelX,
  labelY,
  colors,
  elementOnClick,
}) => {

  let floats = dataJSON.map(x => parseFloat(x.affected_percentage))
  let colorsObj;
  let id: string;
  let sizes;
  let biomeComparator: string;
  let getColor: (serieId: string) => string;
  let getSize: (
    serieId: string | number,
    xValue: string
  ) => number;

  const [dataBiome, setDataBiome] = useState("");

  const dataList: Array<DataListTypes> = dataJSON.map((affectValue) => {
    if (
      parseFloat(affectValue.fc) > 6.5 &&
      parseFloat(affectValue.affected_percentage) > 12
    ) {
      id = "High";
    } else if (
      parseFloat(affectValue.fc) < 6.5 &&
      parseFloat(affectValue.affected_percentage) < 12
    ) {
      id = "Low";
    } else {
      id = "Medium";
    }
    return {
      id: id,
      data: [
        {
          x: affectValue.affected_percentage,
          y: affectValue.fc,
          z:
            affectValue.affected_natural === ""
              ? "0"
              : affectValue.affected_natural,
          biome: affectValue.name,
        },
      ],
    };
  });
  getColor = (serieId) => {
    if (dataBiome === biomeComparator && serieId === "High") {
      return colors[4];
    }
    if (dataBiome === biomeComparator && serieId === "Medium"){
      return colors[5];
    }
    if (dataBiome === biomeComparator && serieId === "Low"){
      return colors[6];
    }
    colorsObj = {
      High: colors[2],
      Medium: colors[0],
      Low: colors[1],
    };
    return colorsObj[serieId] ?? colors[3];
  };

  getSize = (serieId, xValue) => {
    let x = parseFloat(xValue);
    sizes = {
      High: x >= 80 ? x - 30 : x + 4,
      Medium: x >= 80 ? 30 : x + 4,
      Low: x + 4,
    };
    return sizes[serieId] ?? 30;
  };

  return (
    <ResponsiveScatterPlot
      data={dataList}
      onClick={(node) => {
        setDataBiome(node.data.biome)
        elementOnClick(String(node.data.biome));
      }}
      margin={{ top: 20, right: 40, bottom: 60, left: 80 }}
      xScale={{ type: "linear", min: -0.7, max: Math.ceil(Math.max(...floats.map(x=>x)))+ 3 }}
      xFormat=">-.2f"
      yScale={{ type: "linear", min: 4, max: 10 }}
      yFormat=">-.2f"
      theme={{
        text: {
          fontSize: 10,
          fill: "#ea495f",
        },
        axis: {
          legend: {
            text: {
              fontSize: 12,
              fill: "#ea495f",
            },
          },
          ticks: {
            line: {
              stroke: "#ce2222",
              strokeWidth: 0.3,
            },
          },
        },
        grid: {
          line: {
            stroke: "#dbbcc0",
            strokeWidth: 0.2,
          },
        },
      }}
      colors={(obj) => {
        return getColor(String(obj.serieId));
      }}
      blendMode="multiply"
      enableGridX={true}
      enableGridY={true}
      nodeSize={(obj) => {
        biomeComparator = obj.data.biome;
        return getSize(
          obj.serieId,
          String(obj.formattedX),
        );
      }}
      tooltip={({ node }) => {
        return (
          <div
            style={{
              color: node.color,
              backgroundColor: "rgba(0,0,0,0.9)",
              position: "relative",
              padding: "12px",
              lineHeight: "1.5",
              fontSize: "14px",
            }}
          >
            <strong>Afectación:</strong>
            {`${node.formattedX} %`}
            <br />
            <strong>FC:</strong>
            {`${node.formattedY}`}
            <br />
            <strong>Natural:</strong>
            {`${node.data.z}`}
          </div>
        );
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: labelX,
        legendPosition: "middle",
        legendOffset: 46,
      }}
      axisLeft={{
        tickSize: 8,
        tickPadding: 5,
        tickRotation: 0,
        legend: labelY,
        legendPosition: "middle",
        legendOffset: -60,
      }}
      useMesh={false}
    />
  );
};
