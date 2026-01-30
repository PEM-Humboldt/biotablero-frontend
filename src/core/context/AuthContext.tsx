import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import keycloak, { keycloakInitOptions } from '../config/keycloak.config';
import {
  type AuthContextType,
  type AuthState,
  type User,
  type ParsedToken,
  type AuthProviderProps,
  UserRole,
} from '../types/auth.types';
import { routes } from 'Routes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  fallback = <div>Cargando autenticación...</div>,
  onAuthError,
  onAuthSuccess,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
    refreshToken: null,
    error: null,
  });

  const extractRoles = useCallback((token: ParsedToken): UserRole[] => {
    const roles = new Set<string>();
    token.realm_access?.roles?.forEach(role => roles.add(role));
    const clientId =
      import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID || 'biotablero';

    token.resource_access?.[clientId]?.roles?.forEach(role =>
      roles.add(role)
    );

    return Array.from(roles).filter(
      (role): role is UserRole =>
        Object.values(UserRole).includes(role as UserRole)
    );
  }, []);

  const buildUser = useCallback(
    async (): Promise<User | null> => {
      try {
        const profile = await keycloak.loadUserProfile();
        const token = keycloak.tokenParsed as ParsedToken;

        if (!profile || !token) return null;

        return {
          id: profile.id || token.sub || '',
          email: profile.email || token.email || '',
          firstName: profile.firstName || token.given_name,
          lastName: profile.lastName || token.family_name,
          username: profile.username || token.preferred_username,
          roles: extractRoles(token),
          emailVerified: profile.emailVerified || false,
          phoneNumber: (profile as any).attributes?.phoneNumber?.[0],
          gender: (profile as any).attributes?.gender?.[0],
          organization: (profile as any).attributes?.organization?.[0],
          population: (profile as any).attributes?.population?.[0],
        };
      } catch (error) {
        console.error('Error al cargar perfil de usuario:', error);
        return null;
      }
    },
    [extractRoles]
  );

  const updateAuthState = useCallback(
    async (authenticated: boolean) => {
      if (authenticated) {
        const user = await buildUser();

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          token: keycloak.token || null,
          refreshToken: keycloak.refreshToken || null,
          error: null,
        });

        if (user && onAuthSuccess) {
          onAuthSuccess(user);
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        });
      }
    },
    [buildUser, onAuthSuccess]
  );

  useEffect(() => {
    let isMounted = true;

    const initKeycloak = async () => {
      try {
        if (keycloak.didInitialize) {
          if (isMounted) {
            await updateAuthState(!!keycloak.authenticated);
          }
          return;
        }
        if (!isMounted) return;

        const cameFromAccount = !!localStorage.getItem('postAccountRedirect');
        const authenticated = await keycloak.init({
          ...keycloakInitOptions,
          onLoad: cameFromAccount ? 'login-required' : 'check-sso',
        });

        await updateAuthState(authenticated);

        if (authenticated) {
          const redirect = localStorage.getItem('postAccountRedirect');

          if (redirect) {
            localStorage.removeItem('postAccountRedirect');
            routes.navigate("/", { replace: true });
          }
        }

        keycloak.onTokenExpired = () => {
          keycloak.updateToken(import.meta.env.VITE_APP_UPDATE_TOKEN_TIME).catch(() => logout());
        };

        keycloak.onAuthSuccess = () => updateAuthState(true);
        keycloak.onAuthLogout = () => updateAuthState(false);

      } catch (error) {
        console.error('Error inicializando Keycloak', error);
      }
    };

    initKeycloak();

    return () => {
      isMounted = false;
    };
  }, [updateAuthState]);

  const login = useCallback(() => {
    if (!keycloak.didInitialize) {
      console.warn('Keycloak aún no está inicializado');
      return;
    }

    keycloak.login({
      redirectUri: window.location.origin,
    });
  }, []);

  const logout = useCallback(() => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  }, []);

  /**
   * Redirige a la página de registro de Keycloak (caso de prueba 001)
   */
  const register = useCallback(() => {
    keycloak.register({
      redirectUri: window.location.origin,
    });
  }, []);

  /**
   * Actualiza el perfil del usuario (caso de prueba 021)
   */
  const updateProfile = useCallback(() => {
    try {
      localStorage.setItem(
        'postAccountRedirect',
        window.location.pathname + window.location.search
      );

      keycloak.accountManagement();
    } catch (error) {
      console.error('Error al redirigir a gestión de cuenta:', error);

      window.location.href = `${import.meta.env.VITE_APP_KEYCLOAK_URL}/realms/${import.meta.env.VITE_APP_KEYCLOAK_REALM}/account`;
    }
  }, []);

  /**
   * Verifica si el usuario tiene un rol específico (caso de prueba 013)
   */
  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!authState.user?.roles) return false;

      if (Array.isArray(role)) {
        return role.every((r) => authState.user!.roles.includes(r));
      }

      return authState.user.roles.includes(role);
    },
    [authState.user]
  );

  /**
   * Verifica si el usuario tiene al menos uno de los roles
   */
  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!authState.user?.roles) return false;
      return roles.some((role) => authState.user!.roles.includes(role));
    },
    [authState.user]
  );

  /**
   * Refresca el token de acceso manualmente
   */
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshed = await keycloak.updateToken(-1); // Forzar actualización
      if (refreshed) {
        setAuthState((prev) => ({
          ...prev,
          token: keycloak.token || null,
          refreshToken: keycloak.refreshToken || null,
        }));
      }
      return refreshed;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!keycloak.authenticated) return null;
    try {
      await keycloak.updateToken(import.meta.env.VITE_APP_UPDATE_TOKEN_TIME);
      return keycloak.token ?? null;
    } catch (error) {
      console.error("Error actualizando token", error)
      return null;
    }
  }, []);

  const changePassword = useCallback(() => {
    keycloak.login({
      action: 'UPDATE_PASSWORD',
      redirectUri: window.location.origin
    })
  }, [])

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole,
    refreshAccessToken,
    getToken,
  };

  if (authState.isLoading) {
    return <>{fallback}</>;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};