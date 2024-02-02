import {
  ResponsiveScatterPlot,
  ScatterPlotNode,
  ScatterPlotNodeProps,
} from "@nivo/scatterplot";

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

interface NodeType {
  x: string;
  y: string;
  z: string;
  biome: string;
  color: string;
  selectedColor: string;
}

interface DataListTypes {
  id: string;
  data: Array<NodeType>;
}

type Category = "High" | "Medium" | "Low";

const getNode = (selectedBiome: string) => {
  const Node: ScatterPlotNode<NodeType> = ({
    node,
    onClick,
  }: ScatterPlotNodeProps<NodeType>) => {
    return (
      <circle
        cx={node.x}
        cy={node.y}
        r={node.size / 2}
        fill={
          selectedBiome === node.data.biome
            ? node.data.color
            : node.data.selectedColor
        }
        onClick={(event) => (onClick ? onClick(node, event) : null)}
      />
    );
  };
  return Node;
};

export const DotsScatterPlot: React.FC<ScatterProps> = ({
  activeBiome,
  dataJSON,
  labelX,
  labelY,
  colors,
  elementOnClick,
}) => {
  const floats = dataJSON.map((x) => parseFloat(x.affected_percentage));
  let sizes;

  const getColors = (category: string): Array<string> => {
    const selectedColorsObj = {
      High: colors[2],
      Medium: colors[0],
      Low: colors[1],
    };
    const colorsObj = {
      High: colors[4],
      Medium: colors[5],
      Low: colors[6],
    };
    return [
      colorsObj[category as Category],
      selectedColorsObj[category as Category],
    ];
  };

  const dataList: Array<DataListTypes> = dataJSON.map((affectValue) => {
    let category = "Medium";
    if (
      parseFloat(affectValue.fc) > 6.5 &&
      parseFloat(affectValue.affected_percentage) > 12
    ) {
      category = "High";
    } else if (
      parseFloat(affectValue.fc) < 6.5 &&
      parseFloat(affectValue.affected_percentage) < 12
    ) {
      category = "Low";
    }
    const [color, selectedColor] = getColors(category);
    return {
      id: affectValue.name,
      data: [
        {
          x: affectValue.affected_percentage,
          y: affectValue.fc,
          z:
            affectValue.affected_natural === ""
              ? "0"
              : affectValue.affected_natural,
          biome: affectValue.name,
          color,
          selectedColor,
        },
      ],
    };
  });

  /*
   * Previously, to accommodate the sizes, a d3 scale was used, please consult xScale:
   * https://github.com/PEM-Humboldt/biotablero-frontend/blob/34052510ee224c03439edd4a8b531e4929246272/src/pages/compensation/drawer/graphLoader/DotsGraph.jsx#L28
   */
  const getSize = (serieId: string | number, xValue: string): number => {
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
      nodeComponent={getNode(activeBiome)}
      onClick={(node) => {
        elementOnClick(String(node.data.biome));
      }}
      margin={{ top: 20, right: 40, bottom: 60, left: 80 }}
      xScale={{
        type: "linear",
        min: -0.7,
        max: Math.ceil(Math.max(...floats)) + 1,
      }}
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
      blendMode="multiply"
      enableGridX={true}
      enableGridY={true}
      nodeSize={(obj) => {
        return getSize(obj.serieId, String(obj.formattedX));
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
