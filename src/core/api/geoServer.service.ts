import axios, { AxiosInstance } from 'axios';

/**
 * Tipos para las respuestas de GeoServer
 */
export interface GeoServerFeature {
    type: string;
    properties: Record<string, any>;
    geometry: any;
}

export interface GeoServerResponse {
    type: string;
    features: GeoServerFeature[];
    totalFeatures?: number;
    numberMatched?: number;
    numberReturned?: number;
    timeStamp?: string;
    crs?: any;
}

/**
 * Servicio para interactuar con GeoServer
 * No requiere autenticación de Keycloak (es un servicio externo)
 */
class GeoServerService {
    private client: AxiosInstance;
    private baseURL: string;

    constructor() {
        this.baseURL = import.meta.env.VITE_GEOSERVER_URL || 'http://localhost:8080/geoserver';

        // Crear cliente de Axios específico para GeoServer
        // NO usa el api.service porque GeoServer es un servicio externo
        // que no requiere autenticación de Keycloak
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Configurar interceptores
        this.setupInterceptors();
    }

    /**
     * Configurar interceptores para GeoServer
     */
    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                if (import.meta.env.DEV) {
                    console.log('🗺️ GeoServer Request:', config.method?.toUpperCase(), config.url);
                }
                return config;
            },
            (error) => {
                console.error('❌ GeoServer Request Error:', error);
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => {
                if (import.meta.env.DEV) {
                    console.log('🗺️ GeoServer Response:', response.status, response.config.url);
                }
                return response;
            },
            (error) => {
                console.error('❌ GeoServer Response Error:', error.message);

                if (error.response) {
                    const status = error.response.status;
                    let errorMessage = 'Error al consultar GeoServer';

                    switch (status) {
                        case 404:
                            errorMessage = 'Capa no encontrada en GeoServer';
                            break;
                        case 500:
                            errorMessage = 'Error interno de GeoServer';
                            break;
                        case 503:
                            errorMessage = 'GeoServer no disponible';
                            break;
                    }

                    return Promise.reject(new Error(errorMessage));
                }

                return Promise.reject(new Error('No se pudo conectar con GeoServer'));
            }
        );
    }

    /**
     * Construye parámetros WFS estándar
     */
    private buildWFSParams(
        typeName: string,
        cqlFilter?: string,
        additionalParams?: Record<string, string>
    ): string {
        const params = new URLSearchParams({
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typeName,
            outputFormat: 'application/json',
            ...additionalParams,
        });

        if (cqlFilter) {
            params.append('CQL_FILTER', cqlFilter);
        }

        return params.toString();
    }

    /**
     * Request genérico a GeoServer WFS
     */
    async requestWFS(
        workspace: string,
        layer: string,
        cqlFilter?: string,
        additionalParams?: Record<string, string>
    ): Promise<GeoServerResponse> {
        const typeName = `${workspace}:${layer}`;
        const params = this.buildWFSParams(typeName, cqlFilter, additionalParams);
        const endpoint = `${workspace}/ows?${params}`;

        try {
            const response = await this.client.get<GeoServerResponse>(endpoint);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Request a workspace Biotablero
     */
    async requestWFSBiotablero(
        layer: string,
        cqlFilter?: string,
        additionalParams?: Record<string, string>
    ): Promise<GeoServerResponse> {
        return this.requestWFS('Biotablero', layer, cqlFilter, additionalParams);
    }

    /**
     * Request project layers by company
     */
    async requestProjectLayersByCompany(
        companyName: string,
        projectName?: string
    ): Promise<GeoServerResponse | null> {
        if (companyName === 'GEB') {
            const cqlFilter = projectName ? `NOM_GEN='${projectName}'` : undefined;
            return this.requestWFSBiotablero('User_GEB_projects', cqlFilter);
        }
        return null;
    }

    /**
     * Request environmental entities
     */
    async requestEnvironmentalEntities(
        envEntity?: string
    ): Promise<GeoServerResponse> {
        const cqlFilter = envEntity
            ? `GroupByCar like "%'${envEntity}'"`
            : undefined;

        return this.requestWFSBiotablero('BIOMAS_BY_CAR_MP', cqlFilter);
    }

    /**
     * Request Sogamoso layer
     */
    async requestSogamoso(): Promise<GeoServerResponse> {
        return this.requestWFSBiotablero('Sogamoso_84');
    }

    /**
     * Request Corpoboyaca layer
     */
    async requestCorpoboyaca(): Promise<GeoServerResponse> {
        return this.requestWFSBiotablero('Corpoboyaca-Biomas-IaVH-1');
    }

    /**
     * Request Jurisdicciones layer
     */
    async requestJurisdicciones(): Promise<GeoServerResponse> {
        return this.requestWFSBiotablero('jurisdicciones_low');
    }

    /**
     * Request Biomas Sogamoso layer
     */
    async requestBiomasSogamoso(): Promise<GeoServerResponse> {
        return this.requestWFSBiotablero('Sogamoso_Biomas');
    }

    /**
     * Get base URL de GeoServer
     */
    getBaseURL(): string {
        return this.baseURL;
    }

    /**
     * Request personalizado a cualquier endpoint de GeoServer
     */
    async customRequest<T = any>(endpoint: string): Promise<T> {
        try {
            const response = await this.client.get<T>(endpoint);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Request a URL externa (fuera de GeoServer)
     * Útil para testing o servicios externos
     */
    async externalRequest<T = any>(url: string): Promise<T> {
        try {
            const response = await axios.get<T>(url);
            return response.data;
        } catch (error) {
            console.error('❌ External Request Error:', error);
            throw new Error('Error al realizar petición externa');
        }
    }
}

// Exportar instancia singleton
export const geoServerService = new GeoServerService();
export default geoServerService;