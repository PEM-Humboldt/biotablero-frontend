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
import { MetricTypesMap } from "pages/search/types/metrics";
import { DPCCategoryType } from "pages/search/types/connectivity";

type DpcGraphData = ReturnType<CurrentPAConnectivityController["getGraphData"]>;

export class CurrentPAConnectivityController {
  areaType: string = "";
  areaId: number = 0;
  dpcData: Array<DPC> = [];
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get the first 5 values for connectivity according to the given order
   *
   * @param showLowest whether to sort ascending or descending
   *
   * @returns {Promise<{ dpcData: Array<DPC>; graphData: DpcGraphData }>}
   */
  loadSortedDpcData = async (
    showLowest: boolean,
  ): Promise<{
    dpcData: Array<DPC>;
    graphData: DpcGraphData;
  }> => {
    if (this.dpcData.length == 0) {
      this.dpcData = await this.queryDpcData();
    }

    const dpcData = this.dpcData
      .sort((a, b) => (showLowest ? a.dpc - b.dpc : b.dpc - a.dpc))
      .slice(0, 5);

    dpcData.reverse();

    return {
      dpcData: dpcData,
      graphData: this.getGraphData(dpcData),
    };
  };

  /**
   * Get the values for connectivity of the protected areas in a given area.
   *
   * @returns {Promise<{ dpcData: Array<DPC> }>}
   */
  queryDpcData = async (): Promise<Array<DPC>> => {
    const areaId = Number(this.areaId);
    const requestKey = "dpc";
    this.activeRequests.get(requestKey)?.cancel();

    const { request, source } = SearchAPI.requestMetricsValues<"dpc">(
      "dpc",
      areaId,
    );
    this.activeRequests.set(requestKey, source);

    const res: MetricTypesMap["dpc"] = await request;
    this.activeRequests.delete(requestKey);

    if (typeof res === "string") {
      throw new Error("request canceled");
    }

    const normalizedDpc = res
      .map((item) => ({
        id: item.id,
        dpc: Number(item.dpc),
        pa_id: Number(item.pa_id),
        pa_name: String(item.pa_name),
        category: item.category as DPCCategoryType,
      }))
      .filter((item) => item.dpc > 0);

    this.dpcData = normalizedDpc;
    return normalizedDpc;
  };

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<DPC>} rawData raw data from RestAPI
   *
   * @returns {Array<SmallBarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<DPC>) {
    const tooltips: Array<SmallBarTooltip> = [];
    const categories: Set<string> = new Set();
    const transformedData: Array<SmallBarsData> = rawData.map((pa) => {
      const object = {
        group: pa.id,
        data: [
          {
            category: pa.category,
            value: pa.dpc,
          },
        ],
      };

      tooltips.push({
        group: pa.id,
        category: pa.category,
        tooltipContent: [pa.pa_name, `dPC: ${formatNumber(pa.dpc, 3)}`],
      });

      if (!categories.has(pa.category)) {
        categories.add(pa.category);
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
    this.activeRequests.forEach((value, key) => {
      value.cancel();
      this.activeRequests.delete(key);
    });
  };
}
