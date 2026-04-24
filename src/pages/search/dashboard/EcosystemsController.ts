import SearchAPI from "pages/search/api/searchAPI";
import LayerAPI from "pages/search/api/layerAPI";
import { RasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import { MetricsUtils } from "pages/search/utils/metrics";
import { transformCoverageValues } from "pages/search/dashboard/ecosystems/transformData";
import { SmallStackedBarData } from "@composites/charts/SmallStackedBar";

/**
 * Controller for Ecosystems Component
 * @class
 */
export class EcosystemsController {
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
   * Get the coverage values for the current area
   *
   * @returns { Promise<SmallStackedBarData[]>}
   */
  getCoverageValues() {
    return SearchAPI.requestMetricsValues<"coverage">(
      "coverage",
      this.areaId,
    ).then((res) => {
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
   * Get the protected areas values for the current area
   *
   * @returns { Promise<SmallStackedBarData[]>}
   */
  getProtectedAreasValues(totalArea: number): Promise<SmallStackedBarData[]> {
    return SearchAPI.requestMetricsValues<"protectedAreas">(
      "protectedAreas",
      this.areaId,
    ).then((response) => {
      const { id, ...rawValues } = response;
      const items = Object.entries(rawValues)
        .filter(([, value]) => value > 0)
        .map(([key, area]) => ({
          key,
          label: key,
          area,
        }));

      const isNoProtected = (value: string) =>
        value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s|_/g, "") === "noprotegida";

      const hasNoProtected = items.some((item) => isNoProtected(item.key));
      const PATotalArea = items.reduce(
        (acc, item) => (isNoProtected(item.key) ? acc : acc + item.area),
        0,
      );

      if (!hasNoProtected) {
        const noProtectedArea = Math.max(totalArea - PATotalArea, 0);
        items.push({
          area: noProtectedArea,
          label: "No Protegida",
          key: "No Protegida",
        });
      }

      const PAAreas: SmallStackedBarData[] = items.map((item) => ({
        ...item,
        percentage: totalArea > 0 ? item.area / totalArea : 0,
      }));

      return PAAreas;
    });
  }

  /**
   * Get the coverage raster layers for the current area
   *
   * @returns { Promise<Array<RasterLayer>> } layers for the classes in the current area
   */
  async getCoveragesLayers(): Promise<Array<RasterLayer>> {
    if (this.areaId) {
      const requests: Array<Promise<{ layer: string }>> = [];

      this.classes.forEach((classId) => {
        const { request, source } = SearchAPI.requestMetricsLayer(
          "coverage",
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
