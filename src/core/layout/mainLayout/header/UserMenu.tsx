// src/components/UserMenu.tsx

import React, { useState } from 'react';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from 'core/context/AuthContext';
import { UserRole } from '@appTypes/auth.types';

/**
 * Menú de usuario en el header
 * Muestra información del usuario y opciones de logout
 * Casos de prueba relacionados: 005, 020, 021
 */
export const UserMenu: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const handleAdmin = () => {
    navigate('/admin');
    handleMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    // Caso de prueba 020 - Logout
    logout();
  };

  if (!user) return null;

  // Obtener iniciales del nombre
  const getInitials = () => {
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  // Determinar color del rol
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.BT_ADMIN_GENERAL:
        return 'error';
      case UserRole.BT_ADMIN_MONIT_COM:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        size="small"
        aria-controls={anchorEl ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            fontSize: '1rem',
          }}
        >
          {getInitials()}
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 280,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            },
          },
        }}
      >
        {/* Información del usuario */}
        <Box sx={{ px: 2, py: 1.5, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {user.email}
          </Typography>
          
          {/* Roles del usuario - Caso de prueba 013 */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {user.roles.map((role) => (
              <Chip
                key={role}
                label={role}
                size="small"
                color={getRoleColor(role)}
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Opciones del menú */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mi Perfil</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configuración</ListItemText>
        </MenuItem>

        {/* Mostrar opción de admin solo si tiene el rol - Caso de prueba 013 */}
        {hasRole(UserRole.BT_ADMIN_GENERAL) && (
          <>
            <Divider />
            <MenuItem onClick={handleAdmin}>
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Panel de Administración</ListItemText>
            </MenuItem>
          </>
        )}

        <Divider />

        {/* Logout - Caso de prueba 020 */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            <Typography color="error">Cerrar Sesión</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};