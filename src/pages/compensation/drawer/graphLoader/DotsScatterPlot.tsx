import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import { AriaAttributes, FunctionComponent, MouseEvent } from 'react'
import { SpringValues } from '@react-spring/web'
import {
    Dimensions,
    Box,
    Theme,
    ValueFormat,
    MotionProps,
    CssMixBlendMode,
    CartesianMarkerProps,
    PropertyAccessor,
} from '@nivo/core'
import { AnyScale, ScaleSpec } from '@nivo/scales'
import { OrdinalColorScaleConfig } from '@nivo/colors'
import { AxisProps, GridValues } from '@nivo/axes'
import { LegendProps } from '@nivo/legends'
import { AnnotationMatcher } from '@nivo/annotations'


/* interface DataTypes {
    x: string;
    y: string;
    z: string;
    biome: string;
}

interface DataListTypes {
    color: string;
    data: Array<DataTypes>
    formattedX: string
    formattedY: string
    id: string
    index: number
    serieId: string
    serieIndex: number
    size: number
    x: number
    xValue: number
    y: number
    yValue: number
} */


/**
 * Typescript encontrado en el repo de NIVO
 * https://github.com/plouc/nivo/blob/d87af09a2287f55d0496d007ff995c5fa8fc3de2/packages/scatterplot/src/types.ts#L22
 */
export type ScatterPlotValue = number 

export interface ScatterPlotDatum {
    x: ScatterPlotValue
    y: ScatterPlotValue
    z: ScatterPlotValue;
    biome: ScatterPlotValue;
}

export type ScatterPlotRawSerie<RawDatum extends ScatterPlotDatum> = {
    id: string | number
    data: RawDatum[]
}

export interface ScatterPlotNodeData<RawDatum extends ScatterPlotDatum> {
    // absolute index, relative to all points in all series
    index: number
    // relative index, in a specific serie
    serieIndex: number
    id: string
    serieId: ScatterPlotRawSerie<RawDatum>['id']
    // x position
    x: number
    xValue: RawDatum['x']
    formattedX: string | number
    // y position
    y: number
    yValue: RawDatum['y']
    formattedY: string | number
    size: number
    color: string
    data: RawDatum
}

export interface ScatterPlotNodeProps<RawDatum extends ScatterPlotDatum> {
    node: ScatterPlotNodeData<RawDatum>
    style: SpringValues<{
        x: number
        y: number
        size: number
        color: string
    }>
    blendMode: CssMixBlendMode
    isInteractive: boolean
    onMouseEnter?: ScatterPlotMouseHandler<RawDatum>
    onMouseMove?: ScatterPlotMouseHandler<RawDatum>
    onMouseLeave?: ScatterPlotMouseHandler<RawDatum>
    onClick?: ScatterPlotMouseHandler<RawDatum>
}
export type ScatterPlotNode<RawDatum extends ScatterPlotDatum> = FunctionComponent<
    ScatterPlotNodeProps<RawDatum>
>

export interface ScatterPlotTooltipProps<RawDatum extends ScatterPlotDatum> {
    node: ScatterPlotNodeData<RawDatum>
}
export type ScatterPlotTooltip<RawDatum extends ScatterPlotDatum> = FunctionComponent<
    ScatterPlotTooltipProps<RawDatum>
>

export type ScatterPlotLayerId =
    | 'grid'
    | 'axes'
    | 'nodes'
    | 'markers'
    | 'mesh'
    | 'legends'
    | 'annotations'
export interface ScatterPlotLayerProps<RawDatum extends ScatterPlotDatum> {
    xScale: AnyScale
    yScale: AnyScale
    nodes: ScatterPlotNodeData<RawDatum>[]
    innerWidth: number
    innerHeight: number
    outerWidth: number
    outerHeight: number
}
export type ScatterPlotCustomSvgLayer<RawDatum extends ScatterPlotDatum> = FunctionComponent<
    ScatterPlotLayerProps<RawDatum>
>
export type ScatterPlotCustomCanvasLayer<RawDatum extends ScatterPlotDatum> = (
    ctx: CanvasRenderingContext2D,
    props: ScatterPlotLayerProps<RawDatum>
) => void

export interface ScatterPlotNodeDynamicSizeSpec {
    key: string
    values: [number, number]
    sizes: [number, number]
}

export type ScatterPlotMouseHandler<RawDatum extends ScatterPlotDatum> = (
    node: ScatterPlotNodeData<RawDatum>,
    event: MouseEvent<any>
) => void

export interface ScatterPlotDataProps<RawDatum extends ScatterPlotDatum> {
    data: ScatterPlotRawSerie<RawDatum>[]
}

export type ScatterPlotCommonProps<RawDatum extends ScatterPlotDatum> = {
    nodeId: PropertyAccessor<Omit<ScatterPlotNodeData<RawDatum>, 'id' | 'size' | 'color'>, string>
    xScale: ScaleSpec
    xFormat: ValueFormat<RawDatum['x']>
    yScale: ScaleSpec
    yFormat: ValueFormat<RawDatum['y']>
    margin: Box
    enableGridX: boolean
    gridXValues: GridValues<RawDatum['x']>
    enableGridY: boolean
    gridYValues: GridValues<RawDatum['y']>
    axisTop: AxisProps | null
    axisRight: AxisProps | null
    axisBottom: AxisProps | null
    axisLeft: AxisProps | null
    theme: Theme
    colors: OrdinalColorScaleConfig<{ serieId: ScatterPlotRawSerie<RawDatum>['id'] }>
    nodeSize:
        | number
        | ScatterPlotNodeDynamicSizeSpec
        | PropertyAccessor<Omit<ScatterPlotNodeData<RawDatum>, 'size' | 'color'>, number>
    renderWrapper?: boolean
    isInteractive: boolean
    useMesh: boolean
    debugMesh: boolean
    onMouseEnter: ScatterPlotMouseHandler<RawDatum>
    onMouseMove: ScatterPlotMouseHandler<RawDatum>
    onMouseLeave: ScatterPlotMouseHandler<RawDatum>
    onClick: ScatterPlotMouseHandler<RawDatum>
    tooltip: ScatterPlotTooltip<RawDatum>
    annotations: AnnotationMatcher<ScatterPlotNodeData<RawDatum>>[]
    legends: LegendProps[]
    role: string
    ariaLabel: AriaAttributes['aria-label']
    ariaLabelledBy: AriaAttributes['aria-labelledby']
    ariaDescribedBy: AriaAttributes['aria-describedby']
}

export type ScatterPlotSvgProps<RawDatum extends ScatterPlotDatum> = Partial<
    ScatterPlotCommonProps<RawDatum>
> &
    ScatterPlotDataProps<RawDatum> &
    Dimensions &
    MotionProps & {
        blendMode?: CssMixBlendMode
        layers?: (ScatterPlotLayerId | ScatterPlotCustomSvgLayer<RawDatum>)[]
        nodeComponent?: ScatterPlotNode<RawDatum>
        markers?: CartesianMarkerProps<RawDatum['x'] | RawDatum['y']>[]
    }

export type ScatterPlotCanvasProps<RawDatum extends ScatterPlotDatum> = Partial<
    ScatterPlotCommonProps<RawDatum>
> &
    ScatterPlotDataProps<RawDatum> &
    Dimensions & {
        layers?: (ScatterPlotLayerId | ScatterPlotCustomCanvasLayer<RawDatum>)[]
        pixelRatio?: number
        renderNode?: (ctx: CanvasRenderingContext2D, node: ScatterPlotNodeData<RawDatum>) => void
    }


//////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ScatterProps { 
    activeBiome: string
    dataJSON: any
    labelX: string;
    labelY: string;
    colors: Array<string>
    elementOnClick: (key: string)=> void
}

let dataList = []
let id:string, 
getColor:(serieId: string | number)=> any,
getSize:(serieId: string | number, x: number , biome: string) => any, 
colorsObj, sizes, dataBioma:string

export const DotsScatterPlot: React.FC<ScatterProps> = ({
    activeBiome, 
    dataJSON, 
    labelX, 
    labelY, 
    colors, 
    elementOnClick  }) => (
        console.log(dataJSON),
        
    dataList = dataJSON.map( (axis: any)=>{
        if(axis.fc > 6.5 && axis.affected_percentage > 12){
            id = "Alto"
        } else if(axis.fc < 6.5 && axis.affected_percentage < 12){
            id = "Bajo"
        } else {
            id = "Medio"
        }
        return {
                "id":id,
                "data":[
                    {
                    "x": axis.affected_percentage,
                    "y": axis.fc,
                    "z": axis.affected_natural === "" ? "0" : axis.affected_natural,
                    "biome":axis.name
                    }]
                }
        }
    ),
    getColor = (serieId) => {
        if (dataBioma === activeBiome && serieId === "Alto"){
            return "#b23537"
        }
        if (dataBioma === activeBiome && serieId === "Medio"){
            return "#a38230"
        }
        if (dataBioma === activeBiome && serieId === "Bajo"){
            return "#2c636b"
        }
        colorsObj = {
            Alto: colors[2],
            Medio: colors[0],
            Bajo: colors[1],
        }
        return (colorsObj[serieId]);
    },
    getSize = (serieId, x, biome) => {
        dataBioma = biome
        if (biome === activeBiome){
            if (x === 100){
                return x - 50
            }
            return x + 20
        }
        sizes = {
            Alto: x === 100 ? 30 : x + 4,
            Medio: x + 4,
            Bajo: x + 4
        }
        return sizes[serieId]
    },
    <ResponsiveScatterPlot
        data={dataList}
        onClick={ (node)=> {
            elementOnClick(String(node.data.biome));
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
            }
        }}
        colors={ (obj) => {
            return getColor(obj.serieId)}
        }
        blendMode="multiply"
        enableGridX={true}
        enableGridY={true}
        nodeSize={ (obj)=> {
            return getSize(obj.serieId, obj.xValue, String(obj.data.biome))}
        }
        tooltip={({ node }: ScatterPlotTooltipProps<ScatterPlotDatum>) => {
            return <div style={{   
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
        }
        
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: labelX,
            legendPosition: 'middle',
            legendOffset: 46
        }}
        axisLeft={{
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