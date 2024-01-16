import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { patternDotsDef, patternSquaresDef } from '@nivo/core'

let datos = []
let bioma = []
let id
let color
let getColor, getSize
let saludo
let colores
let nodoEsp
let nodoUnico
export const MyResponsiveScatterPlot = ({ data, activeBiome,dataJSON, height, width, labelX, labelY, colors, elementOnClick  }) => (
    //console.log("activeBiome", activeBiome),
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
    getColor = (serieId, changeColor=undefined, nodo) => {
        console.log("SALUDO",nodo);
        switch(changeColor){
                case "Alto":
                    colores = {
                        Alto: changeColor ? "#b23537" : colors[2],
                        Medio: colors[0],
                        Bajo: colors[1],
                    }
                    /* nodoUnico={
                        nodo: "#0000ff"
                    } */ 
                    return (colores[serieId]/* , nodoUnico[nodo] */);
                case "Medio":
                    colores = {
                        Alto: colors[2],
                        Medio:changeColor ? "#a38230" : colors[0],
                        Bajo: colors[1],
                    }
                    return colores[serieId];
                case "Bajo":
                    colores = {
                        Alto: colors[2],
                        Medio: colors[0],
                        Bajo: changeColor ? "#2c636b" : colors[1],
                        }
                        return colores[serieId];
                default:
                    colores = {
                        Alto: colors[2],
                        Medio: colors[0],
                        Bajo: colors[1],
                        }
                    return colores[serieId];
            }
            console.log("desde el if del color" );
            //return colores[serieId]
        
    },
    getSize = (serieId, x) => {
        //console.log("los datos",dataJSON);
        const sizes = {
            Alto: x === 100 ? 30 : x,
            Medio: x +4,
            Bajo: x +4 ,
        }
        return sizes[serieId]
    },
    <ResponsiveScatterPlot
        data={datos}
        keys={['Alto', 'Medio', 'Bajo']}
        defs={[
            patternSquaresDef('squares-pattern', {
                "size": 4,
                "padding": 4,
                "stagger": false,
                "background": "#ffffff",
                "color": "#000000"
              })
        ]}
        fill={[
            
            { match: '*', id: 'squares' },
        ]}
        onClick={ (node)=> {
            elementOnClick(node.data.bioma);
            console.log("ON_CLICK_NODE:", node.data.bioma);
            console.log("activeBiome", activeBiome),
            console.log("NODOS", node),
            console.log("dataJSON: ", dataJSON),
            
            
            saludo = node.serieId
            nodoEsp = node.id
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
            "annotations": {

                "outline": {
                    "stroke": "#000000",
                    "strokeWidth": 6,
                    "outlineWidth": 0,
                    "outlineColor": "#ffffff",
                    "outlineOpacity": 0
                },
            }
        }}
        colors={(obj) => {
            //console.log("OBJ",obj)
            console.log("nosoEsp",nodoEsp);
            return getColor(obj.serieId, saludo, nodoEsp)}}
        blendMode="multiply"
        enableGridX={true}
        enableGridY={true}
        nodeSize={ (obj)=> {
            return getSize(obj.serieId, obj.xValue)}
        }
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
            legend: labelY,
            legendPosition: 'middle',
            legendOffset: -60
        }}
        useMesh={false}
    />
)