// src/examples/UsageExamples.tsx

/**
 * EJEMPLOS DE USO DE LA INTEGRACIÓN DE KEYCLOAK
 * Este archivo contiene ejemplos prácticos de cómo usar la autenticación
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from 'core/context/AuthContext';
import { UserRole } from '@appTypes/auth.types';
import apiService from 'core/services/api.service';
import auditService from 'core/services/audit.service';
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
// import { useAuth } from '../context/AuthContext';
// import { UserRole } from '../types/auth.types';
// import { apiService } from '../services/api.service';
// import { auditService } from '../services/audit.service';

// ============================================
// EJEMPLO 1: Página de Dashboard Simple
// ============================================
export const DashboardExample: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Alert severity="warning">Debes iniciar sesión</Alert>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Bienvenido, {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Email: {user?.email}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Roles: {user?.roles.join(', ')}
      </Typography>
      <Button variant="contained" onClick={logout} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>
    </Box>
  );
};

// ============================================
// EJEMPLO 2: Verificar Roles Específicos
// ============================================
export const AdminPanelExample: React.FC = () => {
  const { hasRole, user } = useAuth();

  if (!hasRole(UserRole.BT_ADMIN_GENERAL)) {
    return (
      <Alert severity="error">
        No tienes permisos de administrador
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Typography>
        Hola Admin {user?.firstName}, aquí puedes gestionar el sistema
      </Typography>
    </Box>
  );
};

// ============================================
// EJEMPLO 3: Condicional por Múltiples Roles
// ============================================
export const ReportsExample: React.FC = () => {
  const { hasAnyRole, user } = useAuth();

  const canViewReports = hasAnyRole([UserRole.BT_ADMIN_GENERAL]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>

      {canViewReports ? (
        <div>
          <Typography>Aquí están los reportes disponibles</Typography>
          {/* Contenido de reportes */}
        </div>
      ) : (
        <Alert severity="warning">
          No tienes permisos para ver reportes
        </Alert>
      )}
    </Box>
  );
};

// ============================================
// EJEMPLO 4: Hacer Peticiones HTTP Autenticadas
// ============================================
export const UserProfileExample: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // El token se agrega automáticamente
        const response = await apiService.get('/users/profile');
        setProfileData(response.data);
      } catch (err) {
        setError('Error al cargar perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Mi Perfil</Typography>
        <Typography>Nombre: {user?.firstName} {user?.lastName}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Teléfono: {profileData?.phoneNumber}</Typography>
        <Typography>Organización: {profileData?.organization}</Typography>
      </CardContent>
    </Card>
  );
};

// ============================================
// EJEMPLO 6: Ver Auditoría (Caso de Prueba 014)
// ============================================
export const AuditLogExample: React.FC = () => {
  const { hasRole } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditEvents = async () => {
      try {
        setLoading(true);
        const auditEvents = await auditService.getAuditEvents({
          limit: 50,
        });
        setEvents(auditEvents.events);
      } catch (error) {
        console.error('Error al cargar auditoría:', error);
      } finally {
        setLoading(false);
      }
    };

    if (hasRole(UserRole.BT_ADMIN_GENERAL)) {
      fetchAuditEvents();
    }
  }, [hasRole]);

  if (!hasRole(UserRole.BT_ADMIN_GENERAL)) {
    return <Alert severity="error">Solo administradores pueden ver la auditoría</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Log de Auditoría
      </Typography>

      {events.map((event) => (
        <Card key={event.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">{event.type}</Typography>
            <Typography variant="body2" color="text.secondary">
              Usuario: {event.userId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fecha: {new Date(event.timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

// ============================================
// EJEMPLO 7: Botón de Login/Logout Condicional
// ============================================
export const AuthButtonExample: React.FC = () => {
  const { isAuthenticated, isLoading, login, logout, user } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Box>
      {!isAuthenticated && (
        <div className="loginBtnCont">
          <button
            type="button"
            className="loginBtn"
            onClick={login}
            title="Iniciar sesión"
          >
            {user ? (
              <AccountCircle className="userBox" style={{ fontSize: "4rem" }} />
            ) : (
              <AccountCircleOutlined
                className="userBox"
                style={{ fontSize: "4rem" }}
              />
            )}
          </button>
        </div>
      )}
    </Box>
  );
};


// ============================================
// EJEMPLO 8: Componente que Muestra Roles
// ============================================
export const RolesBadgeExample: React.FC = () => {
  const { user, hasRole } = useAuth();

  return (
    <Box display="flex" gap={1}>
      {user?.roles.map((role) => (
        <Box
          key={role}
          px={2}
          py={0.5}
          borderRadius={1}
          bgcolor={
            role === UserRole.BT_ADMIN_GENERAL
              ? 'error.main'
              : role === UserRole.BT_ADMIN_GENERAL
                ? 'info.main'
                : 'primary.main'
          }
          color="white"
        >
          <Typography variant="caption">{role}</Typography>
        </Box>
      ))}
    </Box>
  );
};

// ============================================
// EJEMPLO 9: Petición POST con Datos
// ============================================
export const CreateUserExample: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const createUser = async () => {
    try {
      setLoading(true);
      const response = await apiService.post('/users', {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      });
      console.log('Usuario creado:', response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={createUser} disabled={loading}>
      {loading ? 'Creando...' : 'Crear Usuario'}
    </Button>
  );
};

// ============================================
// EJEMPLO 10: Refresh Token Manual
// ============================================
export const RefreshTokenExample: React.FC = () => {
  const { refreshAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        alert('Token refrescado correctamente');
      } else {
        alert('No se pudo refrescar el token');
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleRefresh} disabled={loading}>
      Refrescar Token
    </Button>
  );
};

// ============================================
// EJEMPLO 11: Componente Completo de Header
// ============================================
export const HeaderExample: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      bgcolor="primary.main"
      color="white"
    >
      <Typography variant="h6">Mi Aplicación</Typography>

      {isAuthenticated ? (
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>{user?.firstName}</Typography>
          <RolesBadgeExample />
          <Button variant="outlined" color="inherit" onClick={logout}>
            Salir
          </Button>
        </Box>
      ) : (
        <Button variant="outlined" color="inherit" onClick={login}>
          Iniciar Sesión
        </Button>
      )}
    </Box>
  );
};