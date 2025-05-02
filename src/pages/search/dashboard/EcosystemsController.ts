import BackendAPI from "utils/backendAPI";
import { rasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import { coverageKeys } from "pages/search/types/ecosystems";
import base64 from "pages/search/utils/base64ArrayBuffer";

export class EcosystemsController {
  areaType: string = "";
  areaId: string = "";
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get the raster layers required for a Forest Loss Persistence period
   *
   * @returns { Promise<Array<rasterLayer>> } layers for the categories in the indicated period
   */
  async getCoveragesLayers(): Promise<Array<rasterLayer>> {
    if (this.areaType && this.areaId) {
      const requests: Array<Promise<any>> = [];

      coverageKeys.forEach((category: string) => {
        const { request, source } = BackendAPI.requestCoveragesLayer(
          this.areaType ?? "",
          this.areaId ?? "",
          category
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
          res[idx].data
        )}`,
        selected: false,
        paneLevel: 2,
      }));
    }

    throw Error("Polygon and area undefined");
  }

  /**
   * Get the raster layers required for a Forest Loss Persistence period
   *  @param {string} seType Special Ecosystem type
   *
   * @returns { Promise<Array<rasterLayer>> } layers for the Special Ecosystem type
   */
  async getCoveragesSELayer(seType: string): Promise<Array<rasterLayer>> {
    if (this.areaType && this.areaId) {
      const requests: Array<Promise<any>> = [];
      coverageKeys.forEach((category: string) => {
        const { request, source } = BackendAPI.requestCoveragesSELayer(
          this.areaType ?? "",
          this.areaId ?? "",
          category,
          seType
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
          res[idx].data
        )}`,
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
