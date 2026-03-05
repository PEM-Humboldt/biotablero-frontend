import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  InitiativeFullInfo,
  UserSRC,
} from "pages/monitoring/types/initiative";
import { getInitiative } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useUserCTX } from "@hooks/UserContext";
import {
  initiativeRoleToState,
  JoinRequestStatus,
  UserStateInInitiative,
} from "pages/monitoring/types/userJoinRequest";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

type CurrentInitiativeCTXProps = {
  initiativeId: number | null;
  initiativeInfo: InitiativeFullInfo | null;
  userInInitiativeInfo: UserSRC | null;
  setInitiative: (initiativeId?: number) => Promise<null | string>;
  updateInitiative: () => Promise<void>;
  userStateInInitiative: UserStateInInitiative;
  isLoading: boolean;
};

const CurrentInitiativeContext =
  createContext<CurrentInitiativeCTXProps | null>(null);

export function CurrentInitiativeCTX({
  initialInitiative,
  children,
}: {
  initialInitiative?: number;
  children: ReactNode;
}) {
  const [initiative, setInitiative] = useState<InitiativeFullInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserCTX();
  const { joinRequestsByInitiativeId } = useUserInMonitoringCTX();

  const fetchInitiative = useCallback(async (initiativeId?: number) => {
    if (initiativeId === undefined) {
      setInitiative(null);
      return null;
    }

    setIsLoading(true);

    const initiativeInfo = await getInitiative(initiativeId);

    if (isMonitoringAPIError(initiativeInfo)) {
      setInitiative(null);
      setIsLoading(false);
      return initiativeInfo.data[0].msg;
    }

    setInitiative(initiativeInfo ?? null);
    setIsLoading(false);
    return null;
  }, []);

  useEffect(() => {
    void fetchInitiative(initialInitiative);
  }, [initialInitiative, fetchInitiative]);

  const userStateInInitiative = useMemo<UserStateInInitiative>(() => {
    if (!initiative) {
      return UserStateInInitiative.NO_INITIATIVE;
    }
    if (isLoading) {
      return UserStateInInitiative.IDLE;
    }
    if (!user) {
      return UserStateInInitiative.GUEST;
    }
    if (user.roles.includes("Admin")) {
      return UserStateInInitiative.ADMIN;
    }

    const member = initiative.users.find((u) => u.userName === user.username);

    if (!member) {
      const isPending =
        joinRequestsByInitiativeId[initiative.id]?.status.name ===
        JoinRequestStatus.UNDER_REVIEW;
      return isPending
        ? UserStateInInitiative.USER_ASPIRING
        : UserStateInInitiative.USER_NONE;
    }

    return (
      initiativeRoleToState[member.level.id] ?? UserStateInInitiative.GUEST
    );
  }, [initiative, isLoading, joinRequestsByInitiativeId, user]);

  return (
    <CurrentInitiativeContext.Provider
      value={{
        initiativeId: initiative?.id ?? null,
        initiativeInfo: initiative,
        userInInitiativeInfo:
          initiative?.users.find((u) => u.userName === user?.username) ?? null,
        setInitiative: fetchInitiative,
        updateInitiative: async () => {
          if (initiative) {
            await fetchInitiative(initiative.id);
          }
        },
        userStateInInitiative,
        isLoading,
      }}
    >
      {children}
    </CurrentInitiativeContext.Provider>
  );
}

export function useInitiativeCTX() {
  const context = useContext(CurrentInitiativeContext);
  if (!context) {
    throw new Error(
      "useInitiativeCTX must be used within the CurrentInitiativeContext",
    );
  }

  return context;
}
