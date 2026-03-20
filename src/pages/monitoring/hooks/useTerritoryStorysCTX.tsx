import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
import { TERRITORY_STORIES_PER_PAGE } from "@config/monitoring";

type StoryContextValues = {
  storys: TerritoryStoryShort[];
  storysAmount: number;
  currentStory: TerritoryStoryFull | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setStorysSearchParams: Dispatch<SetStateAction<ODataParams>>;
  isLoading: boolean;
  errors: string[];
  updateStorys: () => Promise<void>;
  updateCurrentStory: () => Promise<void>;
};

const StorysCTX = createContext<StoryContextValues | null>(null);

export function TerritoryStorysCTX({ children }: { children: ReactNode }) {
  const { initiativeInfo } = useInitiativeCTX();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchStorysParams, setStorysSearchParams] = useState<ODataParams>({
    top: TERRITORY_STORIES_PER_PAGE,
  });
  const storysAmount = useRef(0);
  const prevSearchParamsRef = useRef(searchStorysParams);

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

    if (prevSearchParamsRef.current !== searchStorysParams) {
      setCurrentPage(1);
      prevSearchParamsRef.current = searchStorysParams;
    }

    const skip = (currentPage - 1) * TERRITORY_STORIES_PER_PAGE;

    const res = await getTerritoryStoriesFromInitiative(initiativeInfo.id)({
      ...searchStorysParams,
      skip,
    });
    if (isMonitoringAPIError(res)) {
      setIsLoading(false);
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    setIsLoading(false);
    setStorys(res?.value ?? []);
    storysAmount.current = res["@odata.count"];
  }, [initiativeInfo, searchStorysParams, currentPage]);

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
        storysAmount: storysAmount.current,
        currentPage,
        setCurrentPage,
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
