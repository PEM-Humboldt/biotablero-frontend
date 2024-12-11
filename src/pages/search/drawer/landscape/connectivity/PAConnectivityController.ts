import { SmallBarsData } from "pages/search/shared_components/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import RestAPI from "utils/restAPI";
import {
  shapeLayer,
  connectivityFeaturePropierties,
} from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import matchColor from "utils/matchColor";
import * as L from "leaflet";

interface RestAPIObject {
  request: Promise<Object> | undefined;
  source: CancelTokenSource | undefined;
}

export class PAConnectivityController {
  areaType: string | null = null;
  areaId: string | null = null;
  activeRequests: Map<any, any> = new Map();

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

  getLayers = async (layerId: string): Promise<shapeLayer> => {
    let layerData: shapeLayer = {
      id: "",
      paneLevel: null,
      json: undefined,
      active: false,
    };
    let paneLevel: number | null = null;
    let layerStyle;
    let onEachFeature;
    let reqPromise: RestAPIObject = {
      request: undefined,
      source: undefined,
    };

    switch (layerId) {
      case "currentPAConn":
      case "timelinePAConn":
      case "currentSEPAConn":
        if (this.areaType && this.areaId) {
          reqPromise = (await RestAPI.requestDPCLayer(
            this.areaType ?? "",
            this.areaId ?? ""
          )) as RestAPIObject;

          onEachFeature = (
            feature: GeoJSON.Feature,
            selectedLayer: L.Layer
          ) => {
            return this.featureActions(selectedLayer);
          };

          paneLevel = 1;
          layerStyle = this.featureStyle("dpc");
        }
        break;
      case "paramoPAConn":
      case "wetlandPAConn":
      case "dryForestPAConn":
        reqPromise = (await RestAPI.requestPAConnSELayer(
          this.areaType ?? "",
          this.areaId ?? "",
          layerId ?? ""
        )) as RestAPIObject;
        paneLevel = 2;
        layerStyle = this.featureStyle(layerId);
        break;
    }

    const { request, source } = reqPromise;
    this.activeRequests.set(layerId, source);
    const res = await request;
    this.activeRequests.delete(layerId);

    layerData = {
      id: layerId,
      paneLevel: paneLevel,
      json: res,
      active: true,
      onEachFeature: onEachFeature,
      layerStyle: layerStyle,
    };

    return layerData;
  };

  getGeofenceLayer = async (fitBounds: boolean = true): Promise<shapeLayer> => {
    let layerData: shapeLayer = {
      id: "",
      paneLevel: null,
      json: undefined,
      active: false,
    };

    const layerName = "geofence";

    const reqPromise = (await RestAPI.requestGeofenceGeometryByArea(
      this.areaType ?? "",
      this.areaId ?? ""
    )) as RestAPIObject;

    const { request, source } = reqPromise;
    this.activeRequests.set(layerName, source);
    const res = await request;
    this.activeRequests.delete(layerName);

    const layerStyle = this.featureStyle(layerName);

    layerData = {
      id: layerName,
      paneLevel: 1,
      json: res,
      active: true,
      layerStyle: layerStyle,
    };

    return layerData;
  };

  featureActions = (layer: L.Layer) => {
    layer.on({
      mouseover: (event) => this.highlightShapeFeature(event),
      mouseout: (event) => this.resetShapeHighlight(event),
    });
  };

  highlightShapeFeature = (event: L.LeafletMouseEvent) => {
    const feature = event.target;
    const optionsTooltip = { sticky: true };

    feature
      .bindTooltip(
        `<b>${feature.feature.properties.name}:</b>
              <br>dPC ${formatNumber(feature.feature.properties.value, 2)}
              <br>${formatNumber(feature.feature.properties.area, 0)} ha`,
        optionsTooltip
      )
      .openTooltip();

    feature.setStyle({
      fillOpacity: 1,
    });
  };

  resetShapeHighlight = (event: L.LeafletMouseEvent) => {
    const feature = event.target;
    feature.setStyle({ fillOpacity: 0.6 });
    feature.closePopup();
  };

  /**
   * Choose the right color for the section inside the map, according to matchColor function
   * @param {String} type layer type
   * @param {String} color optional key value to select color in match color palette
   *
   * @param {Object} feature target object
   */
  featureStyle =
    (type: string) =>
    (feature: { properties: connectivityFeaturePropierties }) => {
      let fillcolor;

      console.log(feature.properties);

      if (type === "dpc") {
        const key = feature.properties.dpc_cat;
        fillcolor = matchColor("dpc")(key);
      } else if (type === "geofence") {
        fillcolor = matchColor(type)();
      } else {
        fillcolor = matchColor(type)(type);
      }

      return {
        stroke: false,
        fillColor: fillcolor,
        fillOpacity: 0.6,
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
