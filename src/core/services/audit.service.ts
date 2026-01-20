// src/services/audit.service.ts

import { apiService } from './api.service';
import { AuditEvent, AuditEventType } from '../types/auth.types';

/**
 * Filtros para consulta de eventos de auditoría
 */
interface AuditFilters {
  userId?: string;
  eventType?: AuditEventType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Respuesta paginada de eventos
 */
interface AuditEventsResponse {
  events: AuditEvent[];
  total: number;
  hasMore: boolean;
}

/**
 * Servicio de auditoría del sistema
 * Caso de prueba 014 - Auditoría del sistema
 * 
 * Eventos registrados:
 * - LOGIN: Inicio de sesión exitoso
 * - LOGOUT: Cierre de sesión
 * - REGISTER: Registro de nuevo usuario
 * - EMAIL_VERIFICATION: Verificación de correo electrónico
 * - PASSWORD_UPDATE: Actualización de contraseña
 */
class AuditService {
  /**
   * Obtiene eventos de auditoría con filtros
   */
  async getAuditEvents(filters?: AuditFilters): Promise<AuditEventsResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.userId) queryParams.append('userId', filters.userId);
      if (filters?.eventType) queryParams.append('eventType', filters.eventType);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.offset) queryParams.append('offset', filters.offset.toString());

      const response = await apiService.get<AuditEventsResponse>(
        `/audit/events?${queryParams.toString()}`
      );

      return response.data || { events: [], total: 0, hasMore: false };
    } catch (error) {
      console.error('Error al obtener eventos de auditoría:', error);
      throw error;
    }
  }

  /**
   * Obtiene eventos de auditoría de un usuario específico
   */
  async getUserAuditEvents(userId: string, limit = 50): Promise<AuditEvent[]> {
    try {
      const response = await this.getAuditEvents({ userId, limit });
      return response.events;
    } catch (error) {
      console.error('Error al obtener eventos del usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene eventos de auditoría por tipo
   */
  async getEventsByType(
    eventType: AuditEventType,
    limit = 50
  ): Promise<AuditEvent[]> {
    try {
      const response = await this.getAuditEvents({ eventType, limit });
      return response.events;
    } catch (error) {
      console.error('Error al obtener eventos por tipo:', error);
      throw error;
    }
  }

  /**
   * Obtiene eventos de auditoría en un rango de fechas
   */
  async getEventsByDateRange(
    startDate: Date,
    endDate: Date,
    limit = 100
  ): Promise<AuditEvent[]> {
    try {
      const response = await this.getAuditEvents({ startDate, endDate, limit });
      return response.events;
    } catch (error) {
      console.error('Error al obtener eventos por fecha:', error);
      throw error;
    }
  }

  /**
   * Registra un evento de auditoría
   * Nota: Normalmente el backend registra automáticamente los eventos,
   * pero este método está disponible para casos especiales
   */
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      await apiService.post('/audit/events', event);
    } catch (error) {
      console.error('Error al registrar evento de auditoría:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  /**
   * Obtiene estadísticas de eventos de auditoría
   */
  async getAuditStatistics(startDate?: Date, endDate?: Date) {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate.toISOString());
      if (endDate) queryParams.append('endDate', endDate.toISOString());

      const response = await apiService.get(
        `/audit/statistics?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de auditoría:', error);
      throw error;
    }
  }

  /**
   * Exporta eventos de auditoría a CSV
   */
  async exportToCSV(filters?: AuditFilters): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.userId) queryParams.append('userId', filters.userId);
      if (filters?.eventType) queryParams.append('eventType', filters.eventType);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/audit/export?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${(await import('../config/keycloak.config')).default.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al exportar eventos');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error al exportar eventos:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const auditService = new AuditService();

export default auditService;