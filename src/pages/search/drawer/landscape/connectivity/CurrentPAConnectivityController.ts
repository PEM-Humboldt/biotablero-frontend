import { DPC } from "pages/search/types/connectivity";

export class CurrentPAConnectivityController {
  constructor() {}

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<DPC>} rawData raw data from RestAPI
   *
   * @returns {Array<BarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<DPC>) {
    const transformedData = rawData.map((element) => {
      const object: Record<string, string | number> = {
        id: String(element.id),
      };
      object[String(element.id)] = Number(element.value);
      object[`${String(element.id)}Label`] = element.name;
      object[`${String(element.id)}Color`] = "#123456";
      object[`${String(element.id)}DarkenColor`] = "#123456";
      object[`${String(element.id)}Area`] = Number(element.area);
      return object;
    });
    const keys = rawData.map((item) => String(item.id));

    return { transformedData, keys };
  }
}
