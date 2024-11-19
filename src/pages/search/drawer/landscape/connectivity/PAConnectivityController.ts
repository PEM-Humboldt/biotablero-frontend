import { SmallBarsData } from "pages/search/shared_components/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import RestAPI from "utils/restAPI";
import { shapeLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";

interface RestAPIObject {
  request: Promise<Object>;
  source: CancelTokenSource;
}

export class PAConnectivityController {
  areaType: string | null = null;
  areaId: string | null = null;

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<DPC>} rawData raw data from RestAPI
   *
   * @returns {Array<SmallBarsData>} transformed data ready to be used by graph component
   */
  getCPAGraphData(rawData: Array<DPC>) {
    const tooltips: Array<SmallBarTooltip> = [];
    const categories: Set<string> = new Set();
    const transformedData: Array<SmallBarsData> = rawData.map((pa) => {
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
        tooltipContent: [
          pa.name,
          `${formatNumber(pa.value, 2)}`,
          `${formatNumber(pa.area, 2)} ha`,
        ],
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
   * @param {string} layerId Id for the layer to get
   *
   * @returns { shapeLayer } layerData
   * @returns { CancelTokenSource } source
   */

  async getLayers(
    layerId: string
  ): Promise<{ layerData: shapeLayer; source: CancelTokenSource | undefined }> {
    let layerData: shapeLayer = {
      id: "",
      paneLevel: null,
      json: undefined,
      active: false,
    };
    let paneLevel: number | null = null;
    let request;
    let source;

    switch (layerId) {
      case "currentPAConn":
      case "timelinePAConn":
      case "currentSEPAConn":
        if (this.areaType && this.areaId) {
          const reqPromise = (await RestAPI.requestDPCLayer(
            this.areaType ?? "",
            this.areaId ?? ""
          )) as RestAPIObject;
          request = await reqPromise.request;
          source = reqPromise.source;
          paneLevel = 1;
        }
        break;
      case "paramoPAConn":
      case "wetlandPAConn":
      case "dryForestPAConn":
        const reqPromise = (await RestAPI.requestPAConnSELayer(
          this.areaType ?? "",
          this.areaId ?? "",
          layerId ?? ""
        )) as RestAPIObject;
        paneLevel = 2;
        request = await reqPromise.request;
        source = reqPromise.source;
        break;
    }

    layerData = {
      id: layerId,
      paneLevel: paneLevel,
      json: request,
      active: true,
    };

    return { layerData, source };
  }
}
