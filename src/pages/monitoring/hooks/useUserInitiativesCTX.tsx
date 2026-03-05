import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { useUserCTX } from "@hooks/UserContext";

import type { UserInInitiative } from "pages/monitoring/types/odataResponse";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  getUserJoinRequests,
  getUserInitiativesInfo,
} from "pages/monitoring/api/services/initiatives";

import type { UserJoinRequestData } from "pages/monitoring/types/userJoinRequest";

type MonitoringContextProps = {
  userInitiativesAs: { [K in RoleInInitiative]?: UserInInitiative[] };
  userInitiativesById: Record<number, UserInInitiative>;
  userRoleByInitiativeId: Record<number, RoleInInitiative>;
  reloadUserInMonitoringData: () => Promise<void>;
  joinRequestsByInitiativeId: Record<number, UserJoinRequestData>;
  isLoading: boolean;
  error: string | null;
};

const UserMonitoringCTX = createContext<MonitoringContextProps | null>(null);

export function UserInMonitoringCTX({ children }: { children: ReactNode }) {
  const { user } = useUserCTX();
  const [initiatives, setInitiatives] = useState<UserInInitiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinRequests, setJoinRequests] = useState<
    Record<number, UserJoinRequestData>
  >({});

  const fetchInitiatives = useCallback(async () => {
    if (!user?.username) {
      return;
    }

    setIsLoading(true);
    setJoinRequests({});
    setInitiatives([]);
    const initiativesInfo = await getUserInitiativesInfo();

    if (isMonitoringAPIError(initiativesInfo)) {
      setError(initiativesInfo.data[0].msg);
      setIsLoading(false);
      return;
    }

    const requestsInfo = await getUserJoinRequests();

    if (isMonitoringAPIError(requestsInfo)) {
      setError(requestsInfo.data[0].msg);
      setIsLoading(false);
      return;
    }

    const requestsDictionary = requestsInfo.reduce<
      Record<number, UserJoinRequestData>
    >((all, current) => {
      all[current.initiativeId] = current;
      return all;
    }, {});

    setJoinRequests(requestsDictionary);
    setInitiatives(initiativesInfo);
    setIsLoading(false);
  }, [user?.username]);

  useEffect(() => {
    void fetchInitiatives();
  }, [fetchInitiatives]);

  const arrangedInitiatives = useMemo(() => {
    const byId: Record<number, UserInInitiative> = {};
    const rolesById: Record<number, RoleInInitiative> = {};
    const byRole: { [k in RoleInInitiative]?: UserInInitiative[] } = {};

    if (user?.username) {
      for (const initiative of initiatives) {
        byId[initiative.id] = initiative;

        const userDataInInitiative = initiative.users.find(
          (u) => u.userName === user.username,
        );

        const userRoleId = userDataInInitiative?.level.id ?? 0;
        if (!userRoleId || !(userRoleId in RoleInInitiative)) {
          continue;
        }

        const roleId = userRoleId as RoleInInitiative;
        if (!byRole[roleId]) {
          byRole[roleId] = [];
        }
        rolesById[initiative.id] = roleId;
        byRole[roleId].push(initiative);
      }
    }

    return { byId, rolesById, byRole };
  }, [initiatives, user?.username]);

  return (
    <UserMonitoringCTX.Provider
      value={{
        userInitiativesAs: arrangedInitiatives.byRole,
        userInitiativesById: arrangedInitiatives.byId,
        userRoleByInitiativeId: arrangedInitiatives.rolesById,
        reloadUserInMonitoringData: async () => {
          await fetchInitiatives();
        },
        joinRequestsByInitiativeId: joinRequests,
        isLoading,
        error,
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
