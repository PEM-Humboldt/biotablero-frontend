import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth.types';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * Caso de prueba 013 - Validación de roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  requireAll = false,
  fallback,
}) => {
  const { isAuthenticated, isLoading, hasRole, hasAnyRole, login } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    // Guardar la ruta actual para redirigir después del login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    login();
    return null;
  }

  // Verificar roles si se especificaron
  if (roles && roles.length > 0) {
    const hasPermission = requireAll ? hasRole(roles) : hasAnyRole(roles);

    if (!hasPermission) {
      return (
        <>
          {fallback || (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
              gap={2}
              p={3}
            >
              <Typography variant="h4" color="error">
                Acceso Denegado
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No tienes los permisos necesarios para acceder a esta página.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Roles requeridos: {roles.join(', ')}
              </Typography>
            </Box>
          )}
        </>
      );
    }
  }

  return <>{children}</>;
};

/**
 * HOC para proteger componentes con roles específicos
 * Uso alternativo a ProtectedRoute
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  roles?: UserRole[],
  requireAll = false
) => {
  return (props: P) => (
    <ProtectedRoute roles={roles} requireAll={requireAll}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

/**
 * Componente específico para rutas de administrador
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute roles={[UserRole.ADMIN]}>{children}</ProtectedRoute>;
};