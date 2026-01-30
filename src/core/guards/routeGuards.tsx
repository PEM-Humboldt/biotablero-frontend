// src/guards/routeGuards.tsx

import { redirect } from "react-router";
import keycloak from "../config/keycloak.config";
import type { UserType } from "@appTypes/user";

/**
 * Requisitos para acceder a una ruta
 */
interface RouteRequirements {
  roles?: string[];
  requireAllRoles?: boolean;
}

/**
 * Opciones para checkNLoad
 */
interface CheckNLoadOptions<T = any, C = any> {
  requirements?: RouteRequirements;
  redirectPath?: string;
  fetchData?: (user: UserType) => Promise<T>;
  fetchCriticalData?: (user: UserType) => Promise<C>;
}

/**
 * Verifica si el usuario tiene los roles requeridos
 */
const hasRequiredRoles = (
  userRoles: string[],
  requiredRoles: string[],
  requireAll = false
): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (requireAll) {
    return requiredRoles.every((role) => userRoles.includes(role));
  }

  return requiredRoles.some((role) => userRoles.includes(role));
};

/**
 * Extrae roles del token de Keycloak
 */
const getUserRoles = (): string[] => {
  if (!keycloak.tokenParsed) return [];

  const roles: string[] = [];
  const token = keycloak.tokenParsed as any;

  // Roles del realm
  if (token.realm_access?.roles) {
    roles.push(...token.realm_access.roles);
  }

  // Roles del cliente específico
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "biotablero";
  if (token.resource_access?.[clientId]?.roles) {
    roles.push(...token.resource_access[clientId].roles);
  }

  return roles;
};

/**
 * Construye objeto User desde Keycloak
 */
const buildUserFromKeycloak = async (): Promise<UserType | null> => {
  try {
    if (!keycloak.authenticated) return null;

    const profile = await keycloak.loadUserProfile();
    const token = keycloak.tokenParsed as any;
    const roles = getUserRoles();

    // Adaptar al tipo UserType de tu aplicación
    return {
      id: profile.id || token.sub || "",
      email: profile.email || token.email || "",
      firstName: profile.firstName || token.given_name,
      lastName: profile.lastName || token.family_name,
      username: profile.username || token.preferred_username,
      roles: roles,
      emailVerified: profile.emailVerified || false,
      // Campos personalizados según tu UserType
      phoneNumber: (profile as any).attributes?.phoneNumber?.[0],
      gender: (profile as any).attributes?.gender?.[0],
      organization: (profile as any).attributes?.organization?.[0],
      population: (profile as any).attributes?.population?.[0],
    } as UserType;
  } catch (error) {
    console.error("Error al construir usuario desde Keycloak:", error);
    return null;
  }
};

/**
 * Función principal de verificación y carga de datos
 * Compatible con tu implementación actual de checkNLoad
 * 
 * MEJORAS:
 * - Integra Keycloak para autenticación
 * - Mantiene tu estructura de roles
 * - Compatible con fetchData y fetchCriticalData
 * - Maneja renovación de tokens
 */
export const checkNLoad = async <T = any, C = any>(
  options: CheckNLoadOptions<T, C> = {}
) => {
  const {
    requirements = {},
    redirectPath = "/",
    fetchData,
    fetchCriticalData,
  } = options;

  try {
    // 1. Verificar si Keycloak está inicializado
    if (!keycloak.authenticated) {
      // Si no está autenticado, guardar ruta actual y redirigir a login
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      keycloak.login({
        redirectUri: window.location.origin + window.location.pathname,
      });
      // Retornar null para evitar que el loader continúe
      return null;
    }

    // 2. Renovar token si está por expirar (30 segundos de margen)
    try {
      await keycloak.updateToken(import.meta.env.VITE_APP_UPDATE_TOKEN_TIME);
    } catch (error) {
      console.error("Error al renovar token:", error);
      keycloak.logout();
      return null;
    }

    // 3. Construir usuario desde Keycloak
    const user = await buildUserFromKeycloak();
    
    if (!user) {
      throw new Error("No se pudo obtener información del usuario");
    }

    // 4. Verificar roles si se especificaron requisitos
    if (requirements.roles && requirements.roles.length > 0) {
      const userRoles = getUserRoles();
      const hasAccess = hasRequiredRoles(
        userRoles,
        requirements.roles,
        requirements.requireAllRoles
      );

      if (!hasAccess) {
        console.warn(
          `Usuario no tiene los roles requeridos: ${requirements.roles.join(", ")}`
        );
        return redirect(redirectPath);
      }
    }

    // 5. Ejecutar fetchCriticalData primero (si existe)
    let criticalData: C | undefined;
    if (fetchCriticalData) {
      try {
        criticalData = await fetchCriticalData(user);
      } catch (error) {
        console.error("Error al cargar datos críticos:", error);
        throw error; // Datos críticos deben cargar correctamente
      }
    }

    // 6. Ejecutar fetchData en paralelo o después (si existe)
    let data: T | undefined;
    if (fetchData) {
      try {
        data = await fetchData(user);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // Los datos no críticos pueden fallar sin bloquear la ruta
      }
    }

    // 7. Retornar datos cargados
    return {
      user,
      data,
      criticalData,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error en checkNLoad:", error);
    return redirect(redirectPath);
  }
};

/**
 * Guard simple solo para verificar autenticación
 */
export const requireAuth = async (redirectTo = "/") => {
  if (!keycloak.authenticated) {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    keycloak?.login({
      redirectUri: window.location.origin + window.location.pathname,
    });
    return null;
  }

  try {
    await keycloak.updateToken(import.meta.env.VITE_APP_UPDATE_TOKEN_TIME);
    const user = await buildUserFromKeycloak();
    return { user, isAuthenticated: true };
  } catch (error) {
    console.error("Error de autenticación:", error);
    return redirect(redirectTo);
  }
};

/**
 * Guard específico para administradores
 */
export const requireAdmin = async (redirectTo = "/") => {
  const result = await checkNLoad({
    requirements: { roles: ["Admin"] },
    redirectPath: redirectTo,
  });

  return result;
};