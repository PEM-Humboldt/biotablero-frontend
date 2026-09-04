import { SmallBarsData } from "@composites/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import { formatNumber } from "@utils/format";
import { type SmallBarTooltip } from "@composites/charts/SmallBars";
import SearchAPI from "pages/search/api/searchAPI";
import { RasterLayer } from "pages/search/types/layers";
import { matchColor } from "pages/search/utils/matchColor";
import { CancelTokenSource } from "axios";
import { MetricTypesMap } from "pages/search/types/metrics";
import LayerAPI from "pages/search/api/layerAPI";
import { MetricsUtils } from "pages/search/utils/metrics";

type DpcGraphData = ReturnType<CurrentPAConnectivityController["getGraphData"]>;

const ASSOCIATED_COLLECTION = "AreasProtegidas";

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
   * @returns First 5 dpcData items sorted accordingly
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
   * @returns all the dpcData from the backend
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

    const normalizedDpc = res.reduce((acc: Array<DPC>, item) => {
      if (item.dpc < 0) {
        return acc;
      }
      acc.push({
        id: item.id,
        dpc: Number(item.dpc),
        pa_id: Number(item.pa_id),
        pa_name: String(item.pa_name),
        category: item.category,
      });
      return acc;
    }, []);

    this.dpcData = normalizedDpc;
    return normalizedDpc;
  };

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param rawData raw data from RestAPI
   *
   * @returns transformed data ready to be used by graph component
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
   * Get the layers associated to the current area
   *
   * @returns layer data
   */
  getPALayers = async (): Promise<Array<RasterLayer>> => {
    const requests: Array<
      Promise<{ layer: string; bbox?: [number, number, number, number] }>
    > = [];

    const collectionList = await SearchAPI.reqestCollections();
    const collectionObj = collectionList.find(
      (coll) => coll.name === ASSOCIATED_COLLECTION,
    );

    if (!collectionObj) {
      throw new Error("Layers not found");
    }

    this.dpcData.forEach(({ pa_id: paId }) => {
      const { request, source } = SearchAPI.requestCollectionLayer(
        collectionObj?.id,
        paId,
      );
      requests.push(request);
      this.activeRequests.set(`${paId}`, source);
    });

    const res = await Promise.all(requests);

    this.dpcData.forEach(({ pa_id: paId }) => {
      this.activeRequests.delete(`${paId}`);
    });

    if (res.some((result) => typeof result === "string")) {
      throw new Error("request canceled");
    }
    const layersRequests: Array<Promise<Blob>> = [];
    res.forEach((layerObj) => {
      const { request, source } = LayerAPI.getLayerData(layerObj);
      layersRequests.push(request);
      this.activeRequests.set(layerObj.layer, source);
    });

    const layerResponses = await Promise.all(layersRequests);
    res.forEach((layerObj) => {
      this.activeRequests.delete(layerObj.layer);
    });

    if (res.some((result) => typeof result === "string")) {
      throw new Error("request canceled");
    }

    const layersBase64Promises: Array<Promise<string>> = [];

    layerResponses.forEach((response) => {
      const layerBase64 = MetricsUtils.blobToBase64(response);
      layersBase64Promises.push(layerBase64);
    });

    const layersBase64 = await Promise.all(layersBase64Promises);

    return this.dpcData.map(({ id, category }, index) => ({
      id,
      data: layersBase64[index],
      selected: false,
      paneLevel: 2,
      bbox: res[index].bbox,
      color: matchColor("dpc")(category),
    }));
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
