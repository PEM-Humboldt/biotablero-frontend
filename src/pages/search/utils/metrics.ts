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
    static mapLPResponse(lpData: ForestLPRawDataPolygon) : LPResponse {
        return {
            period: lpData.periodo,
            loss: lpData.perdida,
            persistence: lpData.persistencia,
            noForest: lpData.no_bosque,
        }
    }

    /**
     * Calculate Loss Persistence areas in hectares
     * @param lpData Loss Persistence data
     * @returns Loss Persistence object with areas
     */
    static calcLPAreas(lpData: LPResponse): LPAreas {
        let totalHa: number = lpData.noForest + lpData.loss + lpData.persistence;
        let totalHa1Percent = totalHa / 100;

        let response = lpData as LPAreas;
        response.totalHa = totalHa;
        response.lossHa = lpData.loss / totalHa1Percent;
        response.persistenceHa = lpData.persistence / totalHa1Percent;
        response.noForestHa = lpData.noForest / totalHa1Percent;

        return response;
    }
}