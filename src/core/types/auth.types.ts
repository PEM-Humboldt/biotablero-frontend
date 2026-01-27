import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';

/**
 * Roles disponibles en el sistema según casos de prueba
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AUTH_USER = 'AUTH_USER',
  BT_ADMIN_GENERAL = 'BT_ADMIN_GENERAL',
  BT_ADMIN_MONIT_COM = 'BT_ADMIN_MONIT_COM',
  BT_ADMIN_COMP_AMB = 'BT_ADMIN_COMP_AMB',
}

/**
 * Usuario extendido con información de perfil
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  roles: string[]; // Asegúrate de que esto sea string[]
  emailVerified: boolean;
  phoneNumber?: string;
  gender?: string;
  organization?: string;
  population?: string;
  profileImg?: string;
}

/**
 * Token parseado con información personalizada
 */
export interface ParsedToken extends KeycloakTokenParsed {
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
}

/**
 * Contexto de autenticación
 */
export interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  register: () => void;
  updateProfile: () => void;
  changePassword: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  refreshAccessToken: () => Promise<boolean>;
}

/**
 * Eventos de auditoría según caso de prueba 014
 */
export enum AuditEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_UPDATE = 'PASSWORD_UPDATE',
}

/**
 * Estructura de evento de auditoría
 */
export interface AuditEvent {
  id: string;
  type: AuditEventType;
  userId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Opciones de configuración del proveedor de autenticación
 */
export interface AuthProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onAuthError?: (error: Error) => void;
  onAuthSuccess?: (user: User) => void;
}