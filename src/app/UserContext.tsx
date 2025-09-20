import {
  useState,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router";
import { type UserType } from "types/loginUimProps";

type UserContextType = {
  user: UserType | null;
  login: (userToLog: UserType) => void;
  updateUser: (newUserData: Partial<UserType>) => void;
  logout: (goTo?: string) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserCTX({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  const login = useCallback((userToLog: UserType) => {
    setUser(userToLog);
  }, []);

  const updateUser = useCallback((newUserData: Partial<UserType>) => {
    setUser((oldUser) => (oldUser ? { ...oldUser, ...newUserData } : null));
  }, []);

  const logout = useCallback(
    (goTo?: string) => {
      setUser(null);
      void navigate(goTo ?? "/");
    },
    [navigate],
  );

  return (
    <UserContext.Provider value={{ user, login, updateUser, logout }}>
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
