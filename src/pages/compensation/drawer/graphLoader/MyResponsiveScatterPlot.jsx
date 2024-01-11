import { ResponsiveScatterPlot } from '@nivo/scatterplot'

let datos = []
let bioma = []
let id
let color
//let yScale
export const MyResponsiveScatterPlot = ({ data, dataJSON, height, labelX, labelY, colors, elementOnClick  }) => (
    console.log("dataJSON name:", dataJSON[0].name),
    datos = dataJSON.map( (eje)=>{
        if(eje.fc > 6.5 && eje.affected_percentage > 12){
            id = "Alto"
        } else if(eje.fc < 6.5 && eje.affected_percentage < 12){
            id = "Bajo"
        } else {
            id = "Medio"
        }
        return {
                    "id":id,
                    "data":[
                        {
                        "x": eje.affected_percentage,
                        "y": eje.fc,
                        "z": eje.affected_natural === "" ? "0" : eje.affected_natural,
                        "bioma":eje.name
                        }]
                }
        }
    ),
    bioma = dataJSON.map( (biomas)=>{
        return biomas.name
        }
    ),
    // yScale = scaleLinear({
    //     domain: [4, 10],
    //     range: [height - 85, 0],
    //     clamp: true,
    //   }),
    //console.log("nuevos datos:",datos),
    <ResponsiveScatterPlot
        data={datos}
        onClick={ (node)=> {
            elementOnClick(node.data.bioma);
        }
        }
        margin={{ top: 20, right: 40, bottom: 60, left: 80 }}
        xScale={{ type: 'linear', min: 0, max: 'auto' }}
        xFormat=">-.2f"
        yScale={{ type: "linear", min: 4, max: 10 }}
        yFormat=">-.2f"
        theme={{
            "text":{
                "fontSize": 10,
                "fill": "#ea495f",
            },
            "axis": {
                "legend": {
                    "text": {
                        "fontSize": 12,
                        "fill": "#ea495f",
                    }
                }
            },
            "grid": {
                "line": {
                    "stroke": "#dbbcc0",
                    "strokeWidth": 0.2
                }
            },
        }}
        colors={
            color = dataJSON.map( (eje)=>{
                    if(eje.fc > 6.5 && eje.affected_percentage > 12){
                        return colors[2]
                    } else if(eje.fc < 6.5 && eje.affected_percentage < 12){
                        return colors[1]
                    } else {
                        return colors[0]
                    }
                }
            )
        }
        blendMode="multiply"
        enableGridX={true}
        enableGridY={true}
        nodeSize={{
            key: 'data.x',
            values: [0, 30],
            sizes: [9, 32]
        }}
        tooltip={({ node }) => 
            <div style={
                {
                    color: node.color,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    position: 'relative',
                    padding: '12px',
                    lineHeight: '1.5',
                    fontSize: '14px',
                }
            }>
                {/* <strong> */}
                    {/* {node.id} {node.serieId} */}
                {/* </strong> */}
                
                {`Afectación: ${node.formattedX} %`}
                <br />
                {`FC: ${node.formattedY}`}
                <br />
                {`Natural: ${node.data.z}`}
            </div>
        }
        
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: labelX,
            legendPosition: 'middle',
            legendOffset: 46
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            tickValues: 15,
            legend: labelY,
            legendPosition: 'middle',
            legendOffset: -60
        }}
        useMesh={false}
        legends={[
            /* {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 130,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 12,
                itemsSpacing: 5,
                itemDirection: 'left-to-right',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            } */
        ]}
    />
)