import { SmallBarsData } from "pages/search/shared_components/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import RestAPI from 'utils/restAPI';
import { CancelTokenSource } from 'axios';

interface resRestAPI {
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
   * @returns {Promise<Object>} Data of the layer with its id
   */

  async getLayers(layerId: string): Promise<Object>{

    let layerData: Object | Promise<Object> = {};
    
    switch(layerId){
      case 'currentPAConn':
      case 'timelinePAConn':
      case 'currentSEPAConn':
        if (this.areaType && this.areaId) {
          try {
            const res = await RestAPI.requestDPCLayer(
              this.areaType ?? "",
              this.areaId ?? ""
            ) as resRestAPI;
            const geojson = await res.request;
            
            layerData = {
                id: layerId,
                paneLevel: 1,
                json: geojson,
                onEachFeature: undefined,
                active: true
              };
          } catch (error) {
            // TODO: handle error
            throw error;
          }
        }      
        break;
        
        case 'paramoPAConn':
        case 'wetlandPAConn':  
        case 'dryForestPAConn':
          const res = await RestAPI.requestPAConnSELayer(
            this.areaType ?? "",
            this.areaId ?? "",
            layerId ?? "",
          ) as resRestAPI;
          const geojson = await res.request;

          layerData = {
            id: layerId,
            paneLevel: 2,
            json: geojson,
            onEachFeature: undefined,
            active: true
          };
          break;
          
    }
    
    return layerData;
  }
}
