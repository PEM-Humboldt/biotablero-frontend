import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import keycloak, { kongConfig } from '../config/keycloak.config';

/**
 * Opciones para las peticiones HTTP
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean; // Si true, no agrega token de autenticación
  skipKong?: boolean; // Si true, no agrega headers de Kong
}

/**
 * Respuesta tipada de la API
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * Cliente HTTP configurado para trabajar con Keycloak y Kong
 * Incluye:
 * - Renovación automática de tokens
 * - Headers de autenticación
 * - Preparación para Kong Gateway
 * - Manejo centralizado de errores
 */
class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Crear instancia de Axios
    this.client = axios.create({
      baseURL: kongConfig.enabled 
        ? kongConfig.apiUrl 
        : import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Configurar interceptores
    this.setupInterceptors();
  }

  /**
   * Configurar interceptores de request y response
   */
  private setupInterceptors(): void {
    // ==================== REQUEST INTERCEPTOR ====================
    this.client.interceptors.request.use(
      async (config) => {
        const customConfig = config as ApiRequestConfig;

        // Agregar token de autenticación si no se omite
        if (!customConfig.skipAuth) {
          try {
            // Verificar si hay usuario autenticado
            if (keycloak.authenticated) {
              // Renovar token si está por expirar (30 segundos de margen)
              await keycloak.updateToken(30);
              
              // Agregar token al header
              const token = keycloak.token;
              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
              }
            }
          } catch (error) {
            console.error('Error al renovar token:', error);
            // Si falla la renovación, cerrar sesión
            keycloak.logout();
            throw new Error('Sesión expirada');
          }
        }

        // Agregar headers de Kong si está habilitado
        if (kongConfig.enabled && !customConfig.skipKong) {
          if (kongConfig.headers['X-Kong-Request-ID']) {
            // Kong agregará este header automáticamente
            // Aquí solo lo preparamos para recibirlo en la respuesta
          }
        }

        // Log en desarrollo
        if (import.meta.env.DEV) {
          console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // ==================== RESPONSE INTERCEPTOR ====================
    this.client.interceptors.response.use(
      (response) => {
        // Log en desarrollo
        if (import.meta.env.DEV) {
          console.log('📥 Response:', response.status, response.config.url);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as ApiRequestConfig & { _retry?: boolean };

        // Si es error 401 (Unauthorized) y no hemos reintentado
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Intentar renovar el token
            await keycloak.updateToken(-1); // Forzar renovación
            const token = keycloak.token;
            
            if (token && originalRequest.headers) {
              // Reintentar la petición original con el nuevo token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Si falla la renovación, cerrar sesión
            console.error('Error renovando token, cerrando sesión...');
            keycloak.logout();
            return Promise.reject(new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'));
          }
        }

        // Manejar otros errores
        return this.handleError(error);
      }
    );
  }

  /**
   * Maneja errores de la API de forma centralizada
   */
  private handleError(error: AxiosError): Promise<never> {
    let errorMessage = 'Error en la petición';

    if (error.response) {
      // Error con respuesta del servidor
      const status = error.response.status;
      const data: any = error.response.data;

      errorMessage = data?.message || data?.error || error.message;

      // Casos específicos según casos de prueba Humboldt
      switch (status) {
        case 401:
          // Caso de prueba 006 - Login no exitoso
          console.error('No autorizado');
          errorMessage = 'No autorizado. Inicia sesión nuevamente.';
          break;
        
        case 403:
          // Caso de prueba 013 - Validación de roles
          console.error('Acceso denegado');
          errorMessage = 'No tienes permisos para realizar esta acción.';
          break;
        
        case 423:
          // Caso de prueba 019 - Usuario bloqueado
          console.error('Usuario bloqueado');
          errorMessage = 'Tu cuenta ha sido bloqueada por múltiples intentos fallidos.';
          break;
        
        case 429:
          // Rate limiting (Kong)
          console.error('Demasiadas solicitudes');
          errorMessage = 'Demasiadas solicitudes. Por favor, intenta más tarde.';
          break;
        
        case 500:
          console.error('Error del servidor');
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
        
        default:
          console.error(`Error ${status}:`, errorMessage);
      }
    } else if (error.request) {
      // Error sin respuesta del servidor
      console.error('Sin respuesta del servidor:', error.request);
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      // Error al configurar la petición
      console.error('Error en la configuración:', error.message);
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }

  /**
   * Realiza petición GET
   */
  async get<T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza petición POST
   */
  async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza petición PUT
   */
  async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza petición PATCH
   */
  async patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza petición DELETE
   */
  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene la instancia de Axios (para casos especiales)
   */
  getClient(): AxiosInstance {
    return this.client;
  }

  /**
   * Realiza petición con la instancia cruda de Axios
   * Útil para GeoServer u otros servicios externos
   */
  async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();
export default apiService;