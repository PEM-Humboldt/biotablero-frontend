import BackendAPI from "utils/backendAPI";
import { rasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import base64 from "pages/search/utils/base64ArrayBuffer";
import { RasterAPIObject } from "pages/search/types/api";

/**
 * Controller for Ecosystems Component
 * @class
 */
export class NumberOfSpeciesController {
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
   * Get shape layers in GeoJSON format for a connectivity component
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getLayer = async (group: string): Promise<rasterLayer> => {
    const layerId = `numberOfSpecies-${group}`;
    const reqPromise: RasterAPIObject = BackendAPI.requestNOSLayer(
      this.areaType ?? "",
      this.areaId ?? "",
      group
    );

    const { request, source } = reqPromise;
    this.activeRequests.set(layerId, source);
    const res = await request;
    console.log(45, res);
    this.activeRequests.delete(layerId);

    const layerData = {
      id: layerId,
      paneLevel: 2,
      data: `data:png;base64,${base64(res.data)}`,
      selected: false,
    };

    return layerData;
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
