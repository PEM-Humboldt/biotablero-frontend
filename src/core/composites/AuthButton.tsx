import React from 'react';
import { AccountCircle, AccountCircleOutlined } from '@mui/icons-material';
import {
  Box,
} from '@mui/material';
import { useAuth } from 'core/context/AuthContext';

export const AuthButton: React.FC = () => {
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