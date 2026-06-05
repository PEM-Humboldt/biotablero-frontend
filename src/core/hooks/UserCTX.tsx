import {
  useState,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import type Keycloak from "keycloak-js";

import {
  isUserKeycloak,
  type UserKeycloak,
  type UserProfile,
} from "@appTypes/user";
import { getKeycloak, getUserInfo } from "@api/auth";
import { ErrorsList } from "@ui/LabelingWithErrors";

type UserContextType = {
  user: UserProfile | null;
  login: () => Promise<void>;
  updateUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

function generateUserFromKeycloak(userKC: UserKeycloak): UserProfile {
  return {
    username: userKC.username,
    email: userKC.email,
    firstName: userKC.firstName,
    lastName: userKC.lastName,
    roles: userKC.roles,
    picture: userKC.picture,
    selfIdentification: userKC.autorreconocimiento,
    gender: userKC.genero,
    organization: userKC.organizacion,
  };
}

const refreshTokenTimeSeconds = Number(
  window._env_?.VITE_APP_UPDATE_TOKEN_TIME ||
    import.meta.env.VITE_APP_UPDATE_TOKEN_TIME,
);

export function UserCTX({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const startTokenRefreshInterval = useCallback((keycloak: Keycloak) => {
    setErrors([]);
    const interval = setInterval(() => {
      if (keycloak && keycloak.authenticated) {
        keycloak.updateToken(refreshTokenTimeSeconds || 30).catch((err) => {
          setUser(null);
          console.error("Background token refresh failed:", err);
        });
      }
    }, refreshTokenTimeSeconds * 1000);

    return interval;
  }, []);

  const loadUser = useCallback(async () => {
    const keycloak = await getKeycloak();
    if (!keycloak.authenticated) {
      setUser(null);
      return;
    }
    const refreshInterval = startTokenRefreshInterval(keycloak);

    const res = await getUserInfo(keycloak.token ?? "");
    if (!isUserKeycloak(res)) {
      setUser(null);
      console.error(res);
      return setErrors([res.message]);
    }

    setUser(generateUserFromKeycloak(res));

    return () => clearInterval(refreshInterval);
  }, [startTokenRefreshInterval]);

  const handleLogin = useCallback(async () => {
    const keycloak = await getKeycloak();
    await keycloak.login({
      redirectUri: window.location.href,
    });
  }, []);

  const handleLogout = useCallback(async () => {
    const keycloak = await getKeycloak();
    setUser(null);
    await keycloak.logout({
      redirectUri: window.location.href,
    });
  }, []);

  const handleUpdateUser = useCallback(async () => {
    const keycloak = await getKeycloak();
    void keycloak.accountManagement();
  }, []);

  useEffect(() => {
    let clearInterval: void | (() => void) | undefined = undefined;

    void loadUser().then((interval) => {
      clearInterval = interval;
    });

    return () => {
      if (clearInterval) {
        clearInterval();
      }
    };
  }, [loadUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        login: handleLogin,
        updateUser: handleUpdateUser,
        logout: handleLogout,
      }}
    >
      <ErrorsList errorItems={errors} />
      {children}
    </UserContext.Provider>
  );
}

export function useUserCTX() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserCTX must be within the UserProviderCTX");
  }

  return context;
}
