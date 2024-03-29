import { createSymlogScale } from "@nivo/scales";

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
}

interface DataListTypes {
  id: string;
  data: Array<NodeType>;
}

const getNode = (selectedBiome: string) => {
  const Node: ScatterPlotNode<NodeType> = ({
    node,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  }: ScatterPlotNodeProps<NodeType>) => {
    return (
      <circle
        cx={node.x}
        cy={node.y}
        r={node.size / 2}
        fill={node.data.color}
        stroke={selectedBiome === node.data.biome ? "#2a363b" : undefined}
        strokeWidth={2}
        onClick={(event) => onClick?.(node, event)}
        onMouseEnter={(event) => onMouseEnter?.(node, event)}
        onMouseMove={(event) => onMouseMove?.(node, event)}
        onMouseLeave={(event) => onMouseLeave?.(node, event)}
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
  const affectedPercentages = dataJSON.map((x) =>
    parseFloat(x.affected_percentage)
  );

  const dataList: Array<DataListTypes> = dataJSON.map((affectValue) => {
    let color = colors[0];
    if (
      parseFloat(affectValue.fc) > 6.5 &&
      parseFloat(affectValue.affected_percentage) > 12
    ) {
      color = colors[2];
    } else if (
      parseFloat(affectValue.fc) < 6.5 &&
      parseFloat(affectValue.affected_percentage) < 12
    ) {
      color = colors[1];
    }
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
        },
      ],
    };
  });

  /*
   * Previously, to accommodate the sizes, a d3 scale was used, please consult xScale:
   * https://github.com/PEM-Humboldt/biotablero-frontend/blob/34052510ee224c03439edd4a8b531e4929246272/src/pages/compensation/drawer/graphLoader/DotsGraph.jsx#L28
   */
  const getSize = (xValue: string): number => {
    const scale = createSymlogScale(
      { type: "symlog" },
      {
        all: affectedPercentages,
        min: 1,
        max: Math.max(...affectedPercentages),
      },
      28,
      "x"
    );
    return scale(parseFloat(xValue) + 2);
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
        max: Math.ceil(Math.max(...affectedPercentages)) + 1,
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
            strokeWidth: 0.1,
          },
        },
      }}
      blendMode="multiply"
      enableGridX={true}
      enableGridY={true}
      nodeSize={(obj) => getSize(String(obj.formattedX))}
      tooltip={({ node }) => {
        return (
          <div
            style={{
              color: node.data.color,
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
