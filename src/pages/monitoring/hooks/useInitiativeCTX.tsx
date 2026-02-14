import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { commonErrorMessage, getErrorMessage } from "@utils/ui";

import type { InitiativeFullInfo } from "pages/monitoring/types/initiative";
import {
  getInitiative,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";

type CurrentInitiativeCTXProps = {
  initiativeId: number | null;
  initiativeInfo: InitiativeFullInfo | null;
  setInitiative: (initiativeId?: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  const fetchInitiative = useCallback(async (initiativeId?: number) => {
    if (initiativeId === undefined) {
      setInitiative(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const initiativeInfo = await getInitiative(initiativeId);

      if (isMonitoringAPIError(initiativeInfo)) {
        const { status, message, data } = initiativeInfo;
        setError(
          `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
        );

        setInitiative(null);
        return;
      }

      setInitiative(initiativeInfo ?? null);
    } catch (err) {
      console.error(err);
      setError(`Error crítico: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInitiative(initialInitiative);
  }, [initialInitiative, fetchInitiative]);

  return (
    <CurrentInitiativeContext.Provider
      value={{
        initiativeId: initiative?.id ?? null,
        initiativeInfo: initiative,
        setInitiative: fetchInitiative,
        isLoading,
        error,
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
