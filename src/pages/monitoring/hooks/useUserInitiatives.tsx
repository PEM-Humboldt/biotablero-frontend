import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { RoleInInitiative } from "@appTypes/user";
import { useUserCTX } from "@hooks/UserContext";

import type { UserInInitiative } from "pages/monitoring/types/odataResponse";
import { getUserInitiativesInfo } from "pages/monitoring/api/monitoringAPI";

type MonitoringContextProps = {
  userInitiativesAs: { [K in RoleInInitiative]?: UserInInitiative[] };
  userInitiativesById: Record<number, UserInInitiative>;
  userRoleByInitiativeId: Record<number, RoleInInitiative>;
  reloadUserInitiativesData: () => Promise<void>;
  isLoading: boolean;
};

const UserMonitoringCTX = createContext<MonitoringContextProps | null>(null);

export function UserInMonitoringCTX({ children }: { children: ReactNode }) {
  const { user } = useUserCTX();
  const [isLoading, setIsLoading] = useState(true);
  const [userInitiativesAs, setUserInitiativesAs] = useState<{
    [K in RoleInInitiative]?: UserInInitiative[];
  }>({});
  const [userInitiativesById, setUserInitiativesById] = useState<
    Record<number, UserInInitiative>
  >({});
  const [userRoleByInitiativeId, setUserRoleByInitiativeId] = useState<
    Record<number, RoleInInitiative>
  >({});

  const fetchInitiatives = useCallback(async () => {
    if (!user?.username) {
      return;
    }

    try {
      setIsLoading(true);
      const initiatives = await getUserInitiativesInfo();

      const initiativesById: Record<number, UserInInitiative> = {};
      const rolesByInitiativeId: Record<number, RoleInInitiative> = {};
      const initiativesByRole: {
        [k in RoleInInitiative]?: UserInInitiative[];
      } = {};

      for (const initiative of initiatives) {
        initiativesById[initiative.id] = initiative;

        const userDataInInitiative = initiative.users.find(
          (u) => u.userName === user.username,
        );

        const userRoleId = userDataInInitiative?.level.id ?? 0;
        if (!userRoleId || !(userRoleId in RoleInInitiative)) {
          continue;
        }

        const roleId = userRoleId as RoleInInitiative;
        if (!initiativesByRole[roleId]) {
          initiativesByRole[roleId] = [];
        }
        rolesByInitiativeId[initiative.id] = roleId;
        initiativesByRole[roleId].push(initiative);
      }

      setUserInitiativesAs(initiativesByRole);
      setUserRoleByInitiativeId(rolesByInitiativeId);
      setUserInitiativesById(initiativesById);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    void fetchInitiatives();
  }, [user?.username, fetchInitiatives]);

  return (
    <UserMonitoringCTX.Provider
      value={{
        isLoading,
        userInitiativesAs,
        userInitiativesById,
        userRoleByInitiativeId,
        reloadUserInitiativesData: fetchInitiatives,
      }}
    >
      {children}
    </UserMonitoringCTX.Provider>
  );
}

export function useUserInMonitoringCTX() {
  const context = useContext(UserMonitoringCTX);
  if (!context) {
    throw new Error(
      "useMonitoringCTX must be used within the MonitoringContext",
    );
  }

  return context;
}
