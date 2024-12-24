import { SmallBarsData } from "pages/search/shared_components/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import RestAPI from "utils/restAPI";
import {
  shapeLayer,
  connectivityFeaturePropierties,
} from "pages/search/types/layers";
import matchColor from "utils/matchColor";
import { RestAPIObject } from "pages/search/types/api";

export class CurrentPAConnectivityController {
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
  getGraphData(rawData: Array<DPC>) {
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
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */

  getLayers = async (): Promise<shapeLayer> => {
    const layerId = "currentPAConn";

    const reqPromise: RestAPIObject = RestAPI.requestDPCLayer(
      this.areaType ?? "",
      this.areaId ?? ""
    );

    const onEachFeature = (
      feature: GeoJSON.Feature,
      selectedLayer: L.Layer
    ) => {
      return this.featureActions(selectedLayer);
    };

    const layerStyle = (feature: {
      properties: connectivityFeaturePropierties;
    }) => ({
      stroke: false,
      fillColor: matchColor("dpc")(feature.properties.dpc_cat),
      fillOpacity: 0.6,
    });

    const { request, source } = reqPromise;
    this.activeRequests.set(layerId, source);
    const res = await request;
    this.activeRequests.delete(layerId);

    const layerData = {
      id: layerId,
      paneLevel: 1,
      json: res,
      onEachFeature: onEachFeature,
      layerStyle: layerStyle,
    };

    return layerData;
  };

  /**
   * Get shape layers in GeoJSON format for a connectivity component
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */

  getGeofence = async (): Promise<shapeLayer> => {
    const layerId = "geofence";

    const reqPromise: RestAPIObject = RestAPI.requestGeofenceGeometryByArea(
      this.areaType ?? "",
      this.areaId ?? ""
    );

    const layerStyle = {
      stroke: false,
      fillColor: matchColor(layerId)(),
      fillOpacity: 0.6,
    };

    const { request, source } = reqPromise;
    this.activeRequests.set(layerId, source);
    const res = await request;
    this.activeRequests.delete(layerId);

    const layerData = {
      id: layerId,
      paneLevel: 1,
      json: res,
      layerStyle: layerStyle,
    };

    return layerData;
  };
  /**
   * Manage the feature style according to mouse events
   *
   * @param {L.Layer} layer objet
   *
   */
  featureActions = (layer: L.Layer) => {
    layer.on({
      mouseover: (event) => this.highlightShapeFeature(event),
      mouseout: (event) => this.resetShapeHighlight(event),
    });
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
        optionsTooltip
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
   * Apply an specificHighlight an specific feature of the Currenta PA layer
   *
   * @param {Array<shapeLayer>} layers Component layers array
   * @param {string} selectedKey Id of the feature
   */
  highlightStyle = (layers: Array<shapeLayer>, selectedKey: string) => {
    return layers.map((layer) => {
      if (layer.id === "currentPAConn") {
        return {
          ...layer,
          layerStyle: (feature: {
            properties: connectivityFeaturePropierties;
          }) => ({
            fillOpacity: feature.properties.id === selectedKey ? 1 : 0.6,
          }),
        };
      }
      return layer;
    });
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
