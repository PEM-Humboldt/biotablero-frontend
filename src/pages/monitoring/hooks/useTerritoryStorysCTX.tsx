import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router";

import type { ODataParams } from "@appTypes/odata";

import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";
import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import {
  getTerritoryStoriesFromInitiative,
  getTerritoryStory,
} from "pages/monitoring/api/services/territoryStory";

type StoryContextValues = {
  storys: TerritoryStoryShort[];
  currentStory: TerritoryStoryFull | null;
  setStorysSearchParams: Dispatch<SetStateAction<ODataParams>>;
  isLoading: boolean;
  errors: string[];
  updateStorys: () => Promise<void>;
  updateCurrentStory: () => Promise<void>;
};

const StorysCTX = createContext<StoryContextValues | null>(null);

export function TerritoryStorysCTX({ children }: { children: ReactNode }) {
  const { initiativeInfo } = useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchStorysParams, setStorysSearchParams] = useState<ODataParams>({
    top: 20,
    orderby: "creationDate desc",
  });
  const [storys, setStorys] = useState<TerritoryStoryShort[]>([]);
  const [currentStory, setCurrentStory] = useState<TerritoryStoryFull | null>(
    null,
  );

  const { detailItem: currentStoryId } = useParams();

  const getStorys = useCallback(async () => {
    if (!initiativeInfo) {
      return;
    }

    setIsLoading(true);

    const res = await getTerritoryStoriesFromInitiative(initiativeInfo.id)(
      searchStorysParams,
    );
    if (isMonitoringAPIError(res)) {
      setIsLoading(false);
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    setIsLoading(false);
    setStorys(res?.value ?? []);
  }, [initiativeInfo, searchStorysParams]);

  const getCurrentStory = useCallback(async () => {
    if (!currentStoryId) {
      setCurrentStory(null);
      return;
    }

    setIsLoading(true);
    const res = await getTerritoryStory(Number(currentStoryId));
    if (isMonitoringAPIError(res)) {
      setIsLoading(false);
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    setIsLoading(false);
    setCurrentStory(res);
  }, [currentStoryId]);

  useEffect(() => {
    void getStorys();
  }, [getStorys]);

  useEffect(() => {
    void getCurrentStory();
  }, [getCurrentStory]);

  return (
    <StorysCTX.Provider
      value={{
        storys,
        currentStory,
        isLoading,
        errors,
        setStorysSearchParams,
        updateCurrentStory: getCurrentStory,
        updateStorys: getStorys,
      }}
    >
      {children}
    </StorysCTX.Provider>
  );
}

export function useTerritoryStorysCTX() {
  const context = useContext(StorysCTX);

  if (!context) {
    throw new Error(
      "useTerritoryStorysCTX must be used within the TerritoryStorysCTX",
    );
  }

  return context;
}
