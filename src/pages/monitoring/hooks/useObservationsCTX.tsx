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
import { OBSERVATIONS_PER_PAGE } from "@config/monitoring";
import {
  dataTransformBarGraph,
  dataTransformLineGraph,
} from "pages/monitoring/utils/indicatorsTransformers";

type ObservationContextValues = {
  observations: TopicMetadata[];
  isLoading: boolean;
  errors: string[];
  currentObservation: (TopicMetadata & TopicData & CleanDataType) | null;
  setSearchObservations: Dispatch<SetStateAction<ODataParams>>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  observationsAmount: number;
};

const ObservationsContext = createContext<ObservationContextValues | null>(
  null,
);

const dataTransformFunction = {
  [TopicMetric.OCCUPATION_SPECIES]: dataTransformLineGraph,
  [TopicMetric.DETECTION_PROBABILITY_WITHOUT_COVARIABLES]:
    dataTransformLineGraph,
  [TopicMetric.SPECIES_DIVERSITY]: dataTransformLineGraph,
  [TopicMetric.RELATIVE_SPECIES_USE_BY_GROUP]: dataTransformBarGraph,
  [TopicMetric.RELATIONAL_INTENSITY_INDEX]: dataTransformBarGraph,
  [TopicMetric.COLLECTIVE_ACTION_PARTICIPATION]: dataTransformBarGraph,
};

export function ObservationsCTX({ children }: { children: ReactNode }) {
  const { initiativeId, detailItem } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: OBSERVATIONS_PER_PAGE,
  });
  const [observations, setObservations] = useState<TopicMetadata[]>([]);
  const [currentObservation, setCurrentObservation] = useState<
    (TopicMetadata & TopicData & CleanDataType) | null
  >(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const observationsAmount = useRef(0);
  const prevSearchParamsRef = useRef(searchParams);

  const currentObservationId = detailItem;
  const isNewFilter = searchParams !== prevSearchParamsRef.current;
  const resolvedPage = isNewFilter ? 1 : currentPage;

  useEffect(() => {
    const fetchObservations = async () => {
      setIsLoading(true);
      setErrors([]);

      if (initiativeId) {
        const res = await getTopicsByInitiative(Number(initiativeId));
        setIsLoading(false);
        if (isMonitoringAPIError(res)) {
          setErrors(res.data.map((err) => err.msg));
          setObservations([]);
          return;
        }

        setObservations(res.toSorted((a, b) => b.id - a.id));
        observationsAmount.current = res.length;
      } else {
        const skip = (resolvedPage - 1) * OBSERVATIONS_PER_PAGE;
        const res = await getTopics({
          ...searchParams,
          skip,
          top: OBSERVATIONS_PER_PAGE,
        });
        setIsLoading(false);
        if (isMonitoringAPIError(res)) {
          setErrors(res.data.map((err) => err.msg));
          setObservations([]);
          return;
        }

        setObservations(res.value);
        observationsAmount.current = res["@odata.count"];
      }
    };

    prevSearchParamsRef.current = searchParams;
    void fetchObservations();
  }, [searchParams, resolvedPage, initiativeId]);

  useEffect(() => {
    if (!currentObservationId) {
      setCurrentObservation(null);
      return;
    }

    const fetchObservationData = async () => {
      setIsLoading(true);
      setErrors([]);

      const data = await getTopicData(Number(currentObservationId));
      if (isMonitoringAPIError(data)) {
        setIsLoading(false);
        setCurrentObservation(null);
        setErrors(data.data.map((err) => err.msg));
        return;
      }

      const metadata = await getTopicMetadata(data.topicId);
      if (isMonitoringAPIError(metadata)) {
        setIsLoading(false);
        setCurrentObservation(null);
        setErrors(metadata.data.map((err) => err.msg));
        return;
      }

      if (initiativeId && Number(initiativeId) !== metadata.initiativeId) {
        void navigate(
          `/Monitoreo/Iniciativas/${metadata.initiativeId}/Indicadores/${currentObservationId}`,
        );
        return;
      }

      setIsLoading(false);
      setCurrentObservation({
        ...metadata,
        ...data,
        cleanData: dataTransformFunction[metadata.topicType.id](data),
      });
    };

    void fetchObservationData();
  }, [currentObservationId, navigate, initiativeId]);

  return (
    <ObservationsContext.Provider
      value={{
        observations,
        isLoading,
        errors,
        setSearchObservations: setSearchParams,
        currentObservation: currentObservation,
        currentPage,
        setCurrentPage,
        observationsAmount: observationsAmount.current,
      }}
    >
      {children}
    </ObservationsContext.Provider>
  );
}

export function useObservationsCTX() {
  const context = useContext(ObservationsContext);

  if (!context) {
    throw new Error(
      "useObservationsCTX must be used within the ObservationsCTX",
    );
  }

  return context;
}
