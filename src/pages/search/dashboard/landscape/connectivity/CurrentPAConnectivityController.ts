import { SmallBarsData } from "@composites/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import { formatNumber } from "@utils/format";
import { type SmallBarTooltip } from "@composites/charts/SmallBars";
import SearchAPI from "pages/search/api/searchAPI";
import BackendAPI from "pages/search/api/backendAPI";
import {
  ShapeLayer,
  ConnectivityFeaturePropierties,
} from "pages/search/types/layers";
import { matchColor } from "pages/search/utils/matchColor";
import { ShapeAPIObject } from "pages/search/types/api";
import { CancelTokenSource } from "axios";

type DpcGraphData = ReturnType<CurrentPAConnectivityController["getGraphData"]>;

export class CurrentPAConnectivityController {
  areaType: string | null = null;
  areaId: string | null = null;
  activeRequests: Map<string, CancelTokenSource> = new Map();
  dpcRequestId = 0;

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get the values of connectivity for the protected areas with higher dPC value in a given area.
   *
   * @param {boolean} showLowestDpc whether to sort ascending or descending
   *
   * @returns {Promise<{ dpcData: Array<DPC>; graphData: DpcGraphData }>}
   */
  getDpcData = async (
    showLowestDpc: boolean,
  ): Promise<{ dpcData: Array<DPC>; graphData: DpcGraphData }> => {
    const areaId = Number(this.areaId ?? "");
    const requestId = ++this.dpcRequestId;

    const res = await SearchAPI.requestMetricsValues<"dpc">("dpc", areaId)
      .request;
    if (requestId !== this.dpcRequestId) {
      throw new Error("request canceled");
    }

    const normalizedDpc = [...res]
      .map((item: any) => ({
        id: String(item.id ?? item.pa_id ?? ""),
        name: String(item.name ?? item.pa_name ?? ""),
        area: Number(item.area ?? 0),
        value: Number(item.value ?? item.dpc ?? 0),
      }))
      .filter((item) => item.value > 0);

    const sortedByValue = [...normalizedDpc].sort((a, b) => a.value - b.value);
    const total = sortedByValue.length;
    const rankById = new Map(
      sortedByValue.map((item, index) => [item.id, index]),
    );

    const withCategory = normalizedDpc.map((item) => {
      const rank = rankById.get(item.id) ?? 0;
      const percentile = total > 0 ? ((rank + 1) / total) * 100 : 0;
      let key: "muy_bajo" | "bajo" | "medio" | "alto" | "muy_alto" = "muy_bajo";

      if (percentile <= 20) key = "muy_bajo";
      else if (percentile <= 40) key = "bajo";
      else if (percentile <= 60) key = "medio";
      else if (percentile <= 80) key = "alto";
      else key = "muy_alto";

      return {
        ...item,
        key,
      };
    });

    const dpcData = withCategory
      .sort((a, b) => (showLowestDpc ? a.value - b.value : b.value - a.value))
      .slice(0, 5) as DPC[];

    return {
      dpcData,
      graphData: this.getGraphData(dpcData, showLowestDpc),
    };
  };

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<DPC>} rawData raw data from RestAPI
   * @param {boolean} showLowestDpc whether the graph is showing the lower dpc values
   *
   * @returns {Array<SmallBarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<DPC>, showLowestDpc: boolean) {
    const tooltips: Array<SmallBarTooltip> = [];
    const categories: Set<string> = new Set();
    const sortedForGraph = showLowestDpc ? rawData : [...rawData].reverse();
    const transformedData: Array<SmallBarsData> = sortedForGraph.map((pa) => {
      const object = {
        group: pa.id,
        data: [
          {
            category: pa.key,
            value: pa.value,
          },
        ],
      };

      tooltips.push({
        group: pa.id,
        category: pa.key,
        tooltipContent: [pa.name, `dPC: ${formatNumber(pa.value, 2)}`],
      });

      if (!categories.has(pa.key)) {
        categories.add(pa.key);
      }

      return object;
    });

    return { transformedData, keys: Array.from(categories), tooltips };
  }

  /**
   * Get shape layers in GeoJSON format for a connectivity component
   *
   * @returns { Promise<ShapeLayer> } object with the parameters of the layer
   */
  getLayer = async (): Promise<ShapeLayer> => {
    const layerId = "currentPAConn";

    const reqPromise: ShapeAPIObject = BackendAPI.requestDPCLayer(
      this.areaType ?? "",
      this.areaId ?? "",
    );

    const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
      layer.on({
        mouseover: (event) => this.highlightShapeFeature(event),
        mouseout: (event) => this.resetShapeHighlight(event),
      });
    };

    const { request, source } = reqPromise;
    this.activeRequests.set(layerId, source);
    const res = await request;
    this.activeRequests.delete(layerId);

    const layerData = {
      id: layerId,
      paneLevel: 1,
      json: res,
      onEachFeature: onEachFeature,
      layerStyle: this.setLayerStyle(),
    };

    return layerData;
  };

  /**
   * Highlight and set the tooltip
   *
   * @param {L.LeafletMouseEvent} event objet
   *
   */
  highlightShapeFeature = (event: L.LeafletMouseEvent) => {
    const feature = event.target;
    const optionsTooltip = { sticky: true };

    feature
      .bindTooltip(
        `<b>${feature.feature.properties.name}:</b>
          <br>dPC ${formatNumber(feature.feature.properties.value, 2)}
          <br>${formatNumber(feature.feature.properties.area, 0)} ha`,
        optionsTooltip,
      )
      .openTooltip();

    feature.setStyle({
      fillOpacity: 1,
    });
  };

  /**
   * Reset the feature style
   *
   * @param {L.LeafletMouseEvent} event objet
   *
   */
  resetShapeHighlight = (event: L.LeafletMouseEvent) => {
    const feature = event.target;
    feature.setStyle({ fillOpacity: 0.6 });
    feature.closePopup();
  };

  /**
   * Set the features style, applying an specific Highlight if neccesary
   *
   * @param {string} selectedKey Id of the feature to highlight.
   *
   * @returns {Function} function receiving a geoJsonFeature as required by leaflet
   */
  setLayerStyle =
    (selectedKey = "") =>
    (feature?: { properties: ConnectivityFeaturePropierties }) => {
      const color = matchColor("dpc")(feature?.properties.dpc_cat);
      return {
        stroke: false,
        fillColor: (color ?? undefined) as string | undefined,
        fillOpacity: feature?.properties.id === selectedKey ? 1 : 0.6,
      };
    };

  /**
   * Send the cancel signal to all active requests and remove them from the map
   */
  cancelActiveRequests = () => {
    this.dpcRequestId += 1;
    this.activeRequests.forEach((value, key) => {
      value.cancel();
      this.activeRequests.delete(key);
    });
  };
}
