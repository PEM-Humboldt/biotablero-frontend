import {
  useState,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import type { UserProfile } from "@appTypes/user";

// FIX: Revisar si todavía se necesita al finalizar la implementación del login
// import {
//   deleteTokensFromLS,
//   getTokensFromLS,
//   parseUserFromJwt,
//   setTokensInLS,
// } from "@utils/JWTstorage";
// import { isResponseRequestError, refreshAccessToken } from "@api/auth";

import { getKeycloak, keycloak } from "@api/auth";
import { ErrorsList } from "@ui/LabelingWithErrors";
import type { KeycloakProfile, KeycloakTokenParsed } from "keycloak-js";

type UserContextType = {
  user: UserProfile | null;
  login: () => Promise<void>;
  updateUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserCTX({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const loadUser = async () => {
    const keycloak = await getKeycloak();
    if (!keycloak.authenticated) {
      console.log("chao");
      setUser(null);
    }

    const userInfo: KeycloakProfile = await keycloak.loadUserProfile();
    const { username, firstName, lastName, email, attributes } = userInfo;
    const { realm_access } = keycloak.tokenParsed as KeycloakTokenParsed;
    setUser({
      username: username!,
      firstName,
      lastName,
      email,
      attributes: attributes as Record<string, string[]>,
      ...(realm_access ?? { roles: [] }),
    });
  };

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
    void loadUser();
  }, []);

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
