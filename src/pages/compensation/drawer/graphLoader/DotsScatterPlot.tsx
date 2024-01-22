import { ResponsiveScatterPlot } from "@nivo/scatterplot";

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
  activeBiome: string;
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

let dataList: Array<DataListTypes> = [];
let colorsObj;
let id: string;
let sizes;
let dataBiome: string;
let getColor: (serieId: string) => string;
let getSize: (
  serieId: string | number,
  xValue: string,
  biome: string
) => number;

export const DotsScatterPlot: React.FC<ScatterProps> = ({
  activeBiome,
  dataJSON,
  labelX,
  labelY,
  colors,
  elementOnClick,
}) => {
  dataList = dataJSON.map((axis) => {
    if (
      parseFloat(axis.fc) > 6.5 &&
      parseFloat(axis.affected_percentage) > 12
    ) {
      id = "High";
    } else if (
      parseFloat(axis.fc) < 6.5 &&
      parseFloat(axis.affected_percentage) < 12
    ) {
      id = "Low";
    } else {
      id = "Medium";
    }
    return {
      id: id,
      data: [
        {
          x: axis.affected_percentage,
          y: axis.fc,
          z: axis.affected_natural === "" ? "0" : axis.affected_natural,
          biome: axis.name,
        },
      ],
    };
  });
  getColor = (serieId) => {
    if (dataBiome === activeBiome && serieId === "High") {
      return colors[4];
    }
    if (dataBiome === activeBiome && serieId === "Medium") {
      return colors[5];
    }
    if (dataBiome === activeBiome && serieId === "Low") {
      return colors[6];
    }
    colorsObj = {
      High: colors[2],
      Medium: colors[0],
      Low: colors[1],
    };
    return colorsObj[serieId] ?? colors[3];
  };
  getSize = (serieId, xValue, biome) => {
    dataBiome = biome;
    let x = parseFloat(xValue);
    /* if (biome === activeBiome) {
      if (x >= 80) {
        return x - 50;
      }
      return x + 20;
    } */
    sizes = {
      High: x >= 80 ? 30 : x + 4,
      Medium: x + 4,
      Low: x + 4,
    };
    return sizes[serieId] ?? 30;
  };
  return (
    <ResponsiveScatterPlot
      data={dataList}
      onClick={(node) => {
        elementOnClick(String(node.data.biome));
      }}
      margin={{ top: 20, right: 40, bottom: 60, left: 80 }}
      xScale={{ type: "linear", min: 0, max: "auto" }}
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
        //console.log("Z:",obj.data);
        
        return getSize(
          obj.serieId,
          String(obj.data.z),
          //String(obj.formattedX),
          String(obj.data.biome)
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
            {`Afectación: ${node.formattedX} %`}
            <br />
            {`FC: ${node.formattedY}`}
            <br />
            {`Natural: ${node.data.z}`}
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
        tickSize: 5,
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
