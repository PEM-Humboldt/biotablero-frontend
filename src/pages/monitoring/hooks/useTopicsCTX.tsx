import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router";

import type { ODataParams } from "@appTypes/odata";

import {
  TopicMetric,
  type CleanDataType,
  type TopicData,
  type TopicMetadata,
} from "pages/monitoring/types/topics";
import {
  getTopicData,
  getTopicMetadata,
  getTopics,
  getTopicsByInitiative,
} from "pages/monitoring/api/services/topics";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { TOPICS_PER_PAGE } from "@config/monitoring";
import {
  dataTransformBarGraph,
  dataTransformLineGraph,
} from "pages/monitoring/utils/topcisDataTransformers";

type TopicsContextValues = {
  topics: TopicMetadata[];
  isLoading: boolean;
  errors: string[];
  currentTopic: (TopicMetadata & TopicData & CleanDataType) | null;
  setSearchTopics: Dispatch<SetStateAction<ODataParams>>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  topicsAmount: number;
};

const TopicsContext = createContext<TopicsContextValues | null>(null);

const dataTransformFunction = {
  [TopicMetric.OCCUPATION_SPECIES]: dataTransformLineGraph,
  [TopicMetric.DETECTION_PROBABILITY_WITHOUT_COVARIABLES]:
    dataTransformLineGraph,
  [TopicMetric.SPECIES_DIVERSITY]: dataTransformLineGraph,
  [TopicMetric.RELATIVE_SPECIES_USE_BY_GROUP]: dataTransformBarGraph,
  [TopicMetric.RELATIONAL_INTENSITY_INDEX]: dataTransformBarGraph,
  [TopicMetric.COLLECTIVE_ACTION_PARTICIPATION]: dataTransformBarGraph,
};

export function TopicsCTX({ children }: { children: ReactNode }) {
  const { initiativeId, detailItem } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: TOPICS_PER_PAGE,
  });
  const [topics, setTopics] = useState<TopicMetadata[]>([]);
  const [currentTopic, setCurrentTopic] = useState<
    (TopicMetadata & TopicData & CleanDataType) | null
  >(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const topicsAmount = useRef(0);
  const prevSearchParamsRef = useRef(searchParams);

  const currentTopicId = detailItem;
  const isNewFilter = searchParams !== prevSearchParamsRef.current;
  const resolvedPage = isNewFilter ? 1 : currentPage;

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      setErrors([]);

      if (initiativeId) {
        const res = await getTopicsByInitiative(Number(initiativeId));
        setIsLoading(false);
        if (isMonitoringAPIError(res)) {
          setErrors(res.data.map((err) => err.msg));
          setTopics([]);
          return;
        }

        setTopics(res.toSorted((a, b) => b.id - a.id));
        topicsAmount.current = res.length;
      } else {
        const skip = (resolvedPage - 1) * TOPICS_PER_PAGE;
        const res = await getTopics({
          ...searchParams,
          skip,
          top: TOPICS_PER_PAGE,
        });
        setIsLoading(false);
        if (isMonitoringAPIError(res)) {
          setErrors(res.data.map((err) => err.msg));
          setTopics([]);
          return;
        }

        setTopics(res.value);
        topicsAmount.current = res["@odata.count"];
      }
    };

    prevSearchParamsRef.current = searchParams;
    void fetchTopics();
  }, [searchParams, resolvedPage, initiativeId]);

  useEffect(() => {
    if (!currentTopicId) {
      setCurrentTopic(null);
      return;
    }

    const fetchTopicData = async () => {
      setIsLoading(true);
      setErrors([]);

      const data = await getTopicData(Number(currentTopicId));
      if (isMonitoringAPIError(data)) {
        setIsLoading(false);
        setCurrentTopic(null);
        setErrors(data.data.map((err) => err.msg));
        return;
      }

      const metadata = await getTopicMetadata(data.topicId);
      if (isMonitoringAPIError(metadata)) {
        setIsLoading(false);
        setCurrentTopic(null);
        setErrors(metadata.data.map((err) => err.msg));
        return;
      }

      if (initiativeId && Number(initiativeId) !== metadata.initiativeId) {
        void navigate(
          `/Monitoreo/Iniciativas/${metadata.initiativeId}/Indicadores/${currentTopicId}`,
        );
        return;
      }

      setIsLoading(false);
      setCurrentTopic({
        ...metadata,
        ...data,
        cleanData: dataTransformFunction[metadata.topicType.id](data),
      });
    };

    void fetchTopicData();
  }, [currentTopicId, navigate, initiativeId]);

  return (
    <TopicsContext.Provider
      value={{
        topics: topics,
        isLoading,
        errors,
        setSearchTopics: setSearchParams,
        currentTopic: currentTopic,
        currentPage,
        setCurrentPage,
        topicsAmount: topicsAmount.current,
      }}
    >
      {children}
    </TopicsContext.Provider>
  );
}

export function useTopicsCTX() {
  const context = useContext(TopicsContext);

  if (!context) {
    throw new Error("useTopicsCTX must be used within the TopicsCTX");
  }

  return context;
}
