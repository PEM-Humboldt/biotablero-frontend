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
  isUserProfile,
  type UserKeycloak,
  type UserProfile,
} from "@appTypes/user";
import { getKeycloak, getUserInfo } from "@api/auth";
import { ErrorsList } from "@ui/LabelingWithErrors";

import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

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
    autorreconocimiento: userKC.autorreconocimiento,
    picture: userKC.picture,
    genero: userKC.genero,
    organizacion: userKC.organizacion,
  };
}

export function UserCTX({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const startTokenRefreshInterval = useCallback((keycloak: Keycloak) => {
    const interval = setInterval(() => {
      if (keycloak && keycloak.authenticated) {
        keycloak
          .updateToken(30)
          .then((refreshed: boolean) => {
            if (refreshed) {
              console.log("Token refrescado en segundo plano exitosamente");
            }
          })
          .catch(() => {
            console.error("Error refrescando el token en segundo plano");
          });
      }
    }, 30000);

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
    if (!isUserProfile(res)) {
      setUser(null);
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

  // HACK: mientras se cuadran los usuarios de compensaciones en el
  // keycloak, para habilitar el uso con el usuario de la GEB
  const { user, updateUser } = context;
  useEffect(() => {
    if (user?.username === "geb") {
      updateUser({
        name: "Grupo Energía Bogotá",
        company: { id: 1, name: "Grupo Energía Bogotá" },
      });
    }
  }, [updateUser, user?.username]);

  return context;
}
