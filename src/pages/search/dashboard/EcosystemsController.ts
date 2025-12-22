import BackendAPI from "pages/search/api/backendAPI";
import SearchAPI from "pages/search/api/searchAPI";
import { RasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import { coverageKeys } from "pages/search/types/ecosystems";
import base64 from "pages/search/utils/base64ArrayBuffer";
import { MetricsUtils } from "pages/search/utils/metrics";

/**
 * Controller for Ecosystems Component
 * @class
 */
export class EcosystemsController {
  areaType: string = "";
  areaId: string = "";
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  /**
   * Set area values for the controller
   *  @param {string} areaType Value for the type of area selected
   *  @param {string} areaId Value for the id of area selected
   */
  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get the raster layers required for a Coverage type
   *
   * @returns { Promise<Array<RasterLayer>> } layers for the categories in the indicated period
   */
  async getCoveragesLayers(period: string): Promise<Array<RasterLayer>> {
    if (this.areaId) {
      const requests: Array<Promise<{ layer: string }>> = [];

      Object.keys(coverageKeys).forEach((categoryId) => {
        const { request, source } = SearchAPI.requestMetricsLayer(
          "Coverage",
          period,
          coverageKeys[categoryId],
          Number(this.areaId),
        );
        requests.push(request);
        this.activeRequests.set(categoryId, source);
      });

      const res = await Promise.all(requests);

      Object.keys(coverageKeys).forEach((categoryKey) => {
        this.activeRequests.delete(categoryKey);
      });

      if (res.includes("request canceled")) throw Error("request canceled");

      const layersRequests: Array<Promise<Blob>> = [];
      res.forEach((response) => {
        const request = SearchAPI.getLayerData(response);
        layersRequests.push(request);
      });

      const layerResponses = await Promise.all(layersRequests);

      const layersBase64Promises: Array<Promise<string>> = [];

      layerResponses.forEach((response) => {
        const layerBase64 = MetricsUtils.blobToBase64(response);
        layersBase64Promises.push(layerBase64);
      });

      const layersBase64 = await Promise.all(layersBase64Promises);

      return Object.keys(coverageKeys).map((category, index) => ({
        id: category,
        data: layersBase64[index],
        selected: false,
        paneLevel: 2,
      }));
    }
    throw Error("Polygon and area undefined");
  }

  /**
   * Get the raster layers required for a Special Ecosystem type
   *  @param {string} seType Special Ecosystem type
   *
   * @returns { Promise<Array<RasterLayer>> } layers for the Special Ecosystem type
   */

  // TODO: Refactor to use SearchAPI when available

  /*
  async getCoveragesSELayer(seType: string): Promise<Array<RasterLayer>> {
    if (this.areaType && this.areaId) {
      const requests: Array<Promise<any>> = [];
      coverageKeys.forEach((category: string) => {
        const { request, source } = BackendAPI.requestCoveragesSELayer(
          this.areaType ?? "",
          this.areaId ?? "",
          category,
          seType,
        );
        requests.push(request);
        this.activeRequests.set(category, source);
      });

      const res = await Promise.all(requests);

      coverageKeys.forEach((category) => {
        this.activeRequests.delete(category);
      });

      if (res.includes("request canceled")) throw Error("request canceled");

      return coverageKeys.map((category, idx) => ({
        id: category,
        data: `data:${res[idx].headers["content-type"]};base64, ${base64(
          res[idx].data,
        )}`,
        selected: false,
        paneLevel: 2,
      }));
    }

    throw Error("Polygon and area undefined");
  }
  */

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
