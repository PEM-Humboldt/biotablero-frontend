import {
  ForestLPRawDataPolygon,
  LPAreas,
  LPResponse,
} from "pages/search/types/forest";
import { MetricTypesMap } from "pages/search/types/metrics";

/**
 * Metrics utils
 */
export class MetricsUtils {
  /** **************** **/
  /** LOSS PERSISTENCE **/
  /** **************** **/

  /**
   * Map Loss Persistence object from back end
   * @param lpData Loss Persistence back end data
   * @returns Loss Persistence mapped data
   */
  static mapLPForestData(lpData: ForestLPRawDataPolygon): LPResponse {
    return {
      period: lpData.periodo,
      loss: lpData.perdida,
      persistence: lpData.persistencia,
      noForest: lpData.no_bosque,
    };
  }

  /**
   * Convert blob object to Base64 string
   * @param blob Blob data
   * @returns Base64 string
   */
  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
