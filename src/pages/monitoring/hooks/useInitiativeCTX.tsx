import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { commonErrorMessage, getErrorMessage } from "@utils/ui";

import type {
  InitiativeFullInfo,
  UserSRC,
} from "pages/monitoring/types/initiative";
import {
  getInitiative,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
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
  updateInitiative: () => Promise<null | string>;
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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserCTX();
  const { joinRequestsByInitiativeId } = useUserInMonitoringCTX();

  const fetchInitiative = useCallback(async (initiativeId?: number) => {
    if (initiativeId === undefined) {
      setInitiative(null);
      return null;
    }

    setIsLoading(true);
    try {
      const initiativeInfo = await getInitiative(initiativeId);

      if (isMonitoringAPIError(initiativeInfo)) {
        const { status, message, data } = initiativeInfo;

        setInitiative(null);
        return `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`;
      }

      setInitiative(initiativeInfo ?? null);
      return null;
    } catch (err) {
      console.error(err);
      return `Error crítico: ${getErrorMessage(err)}`;
    } finally {
      setIsLoading(false);
    }
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
        updateInitiative: async () => await fetchInitiative(initiative?.id),
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
