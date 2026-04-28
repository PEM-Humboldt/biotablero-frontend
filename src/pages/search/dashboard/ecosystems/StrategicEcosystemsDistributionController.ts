import SearchAPI from "pages/search/api/searchAPI";
import LayerAPI from "pages/search/api/layerAPI";
import { RasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import { MetricsUtils } from "pages/search/utils/metrics";
import { transformCoverageValues } from "pages/search/dashboard/ecosystems/transformData";
import { SEKey } from "pages/search/types/ecosystems";

/**
 * Controller for Strategic Ecosystems Distribution Component
 * @class
 */
export class StrategicEcosystemsDistributionController {
  areaType: string = "";
  areaId: number = 0;
  activeRequests: Map<string, CancelTokenSource> = new Map();
  classes: Set<string> = new Set();
  itemId: string = "";
  constructor() {}

  /**
   * Set area values for the controller
   *  @param {string} areaType Value for the type of area selected
   *  @param {number} areaId Value for the id of area selected
   */
  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get the coverage values for strategic ecosystems of the current area
   *
   * @returns { Promise<SmallStackedBarData[]>}
   */
  getStrategicEcosystemsDistributionValues(SEType: SEKey) {
    const metricId = `coverage_${SEType}` as const;
    return SearchAPI.requestMetricsValues(metricId, this.areaId).then((res) => {
      const { id, ...classes } = res;
      this.itemId = id;
      this.classes = new Set(
        Object.keys(classes).filter(
          (classId) => classes[classId as keyof typeof classes] != 0.0,
        ),
      );
      return transformCoverageValues(res);
    });
  }

  /**
   * Get the coverage raster layers for strategic ecosystems of the current area
   *
   * @returns { Promise<Array<RasterLayer>> } layers for the classes in the current area
   */
  async getStrategicEcosystemsDistributionLayers(
    SEType: SEKey,
  ): Promise<Array<RasterLayer>> {
    if (this.areaId) {
      const requests: Array<Promise<{ layer: string }>> = [];

      this.classes.forEach((classId) => {
        const { request, source } = SearchAPI.requestMetricsLayer(
          `coverage_${SEType}`,
          this.itemId,
          classId,
          Number(this.areaId),
        );
        requests.push(request);
        this.activeRequests.set(classId, source);
      });

      const res = await Promise.all(requests);

      this.classes.forEach((classId) => {
        this.activeRequests.delete(classId);
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

      return [...this.classes].map((classId, index) => ({
        id: classId,
        data: layersBase64[index],
        selected: false,
        paneLevel: 2,
      }));
    }
    throw Error("Polygon and area undefined");
  }

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
