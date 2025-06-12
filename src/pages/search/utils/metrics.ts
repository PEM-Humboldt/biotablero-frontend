import { ForestLPRawDataPolygon, LPAreas, LPResponse } from "../types/forest";

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
  static mapLPResponse(lpData: ForestLPRawDataPolygon): LPResponse {
    return {
      period: lpData.periodo,
      loss: lpData.perdida,
      persistence: lpData.persistencia,
      noForest: lpData.no_bosque,
    };
  }

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
   * Calculate Loss Persistence percentages
   * @param lpData Loss Persistence data
   * @returns Loss Persistence object with percentages
   */
  static calcLPAreas(lpData: LPResponse): LPAreas {
    let totalHa: number = lpData.noForest + lpData.loss + lpData.persistence;
    let totalHaOnePercent: number = totalHa / 100;

    let response = lpData as LPAreas;
    response.percentagesLoss = lpData.loss / totalHaOnePercent;
    response.percentagesPersistence = lpData.persistence / totalHaOnePercent;
    response.percentagesNoForest = lpData.noForest / totalHaOnePercent;

    return response;
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
