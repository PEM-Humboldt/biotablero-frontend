import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  stories: TerritoryStoryShort[];
  storysAmount: number;
  currentStory: TerritoryStoryFull | null;
  nextStory: TerritoryStoryShort | null;
  prevStory: TerritoryStoryShort | null;
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
    orderby: "creationDate desc",
  });
  const storysAmount = useRef(0);
  const prevSearchParamsRef = useRef(searchStorysParams);

  const [stories, setStorys] = useState<TerritoryStoryShort[]>([]);
  const [currentStory, setCurrentStory] = useState<TerritoryStoryFull | null>(
    null,
  );

  const { detailItem: currentStoryId } = useParams();

  const isNewFilter =
    searchStorysParams.filter !== prevSearchParamsRef.current.filter;
  const resolvedPage = isNewFilter ? 1 : currentPage;

  const getStorys = useCallback(async () => {
    if (!initiativeInfo) {
      return;
    }
    setIsLoading(true);
    const skip = (resolvedPage - 1) * TERRITORY_STORIES_PER_PAGE;

    const res = await getTerritoryStoriesFromInitiative(initiativeInfo.id)({
      ...searchStorysParams,
      skip,
    });
    setIsLoading(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    setStorys(res.value);
    storysAmount.current = res["@odata.count"];
  }, [initiativeInfo, searchStorysParams, resolvedPage]);

  const getCurrentStory = useCallback(async () => {
    if (!currentStoryId) {
      setCurrentStory(null);
      return;
    }
    setIsLoading(true);

    const res = await getTerritoryStory(Number(currentStoryId));
    setIsLoading(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    setCurrentStory(res);
  }, [currentStoryId]);

  useEffect(() => {
    if (resolvedPage !== currentPage) {
      setCurrentPage(resolvedPage);
    }
    prevSearchParamsRef.current = searchStorysParams;
  }, [resolvedPage, currentPage, searchStorysParams]);

  useEffect(() => {
    void getStorys();
  }, [getStorys]);

  useEffect(() => {
    void getCurrentStory();
  }, [getCurrentStory]);

  const { prevStory, nextStory } = useMemo(() => {
    const index = stories.findIndex(
      (story) => story.id === Number(currentStoryId),
    );

    if (index === -1) {
      return { prevStory: null, nextStory: null };
    }

    return {
      prevStory: index > 0 ? stories[index - 1] : null,
      nextStory: index < stories.length - 1 ? stories[index + 1] : null,
    };
  }, [stories, currentStoryId]);

  return (
    <StorysCTX.Provider
      value={{
        stories,
        storysAmount: storysAmount.current,
        currentPage,
        setCurrentPage,
        currentStory,
        nextStory,
        prevStory,
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
