import {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useContext,
  useRef,
  type SetStateAction,
  type Dispatch,
} from "react";
import { useNavigate, useParams } from "react-router";

import type { ODataParams } from "@appTypes/odata";

import {
  type CleanDataType,
  type ObservationData,
  type ObservationMetadata,
  ObservationMetric,
} from "pages/monitoring/types/observations";
import {
  getObservationData,
  getObservationMetadata,
  getObservations,
  getObservationsByInitiative,
} from "pages/monitoring/api/services/observations";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { INDICATORS_PER_PAGE } from "@config/monitoring";
import {
  dataTransformBarGraph,
  dataTransformLineGraph,
} from "pages/monitoring/utils/indicatorsTransformers";

type ObservationContextValues = {
  indicators: ObservationMetadata[];
  isLoading: boolean;
  errors: string[];
  currentIndicator:
    | (ObservationMetadata & ObservationData & CleanDataType)
    | null;
  setSearchIndicators: Dispatch<SetStateAction<ODataParams>>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  indicatorsAmount: number;
};

const IndicatorsContext = createContext<ObservationContextValues | null>(null);

const dataTransformFunction = {
  [ObservationMetric.OCCUPATION_SPECIES]: dataTransformLineGraph,
  [ObservationMetric.DETECTION_PROBABILITY_WITHOUT_COVARIABLES]:
    dataTransformLineGraph,
  [ObservationMetric.SPECIES_DIVERSITY]: dataTransformLineGraph,
  [ObservationMetric.RELATIVE_SPECIES_USE_BY_GROUP]: dataTransformBarGraph,
  [ObservationMetric.RELATIONAL_INTENSITY_INDEX]: dataTransformBarGraph,
  [ObservationMetric.COLLECTIVE_ACTION_PARTICIPATION]: dataTransformBarGraph,
};

export function IndicatorsCTX({ children }: { children: ReactNode }) {
  const { initiativeId, detailItem, indicatorId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: INDICATORS_PER_PAGE,
  });
  const [indicators, setIndicators] = useState<ObservationMetadata[]>([]);
  const [currentIndicator, setCurrentIndicator] = useState<
    (ObservationMetadata & ObservationData & CleanDataType) | null
  >(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const indicatorsAmount = useRef(0);
  const prevSearchParamsRef = useRef(searchParams);

  const currentIndicatorId = detailItem || indicatorId;
  const isNewFilter = searchParams !== prevSearchParamsRef.current;
  const resolvedPage = isNewFilter ? 1 : currentPage;

  useEffect(() => {
    const fetchIndicators = async () => {
      setIsLoading(true);
      setErrors([]);

      if (initiativeId) {
        const res = await getObservationsByInitiative(Number(initiativeId));
        setIsLoading(false);
        if (isMonitoringAPIError(res)) {
          setErrors(res.data.map((err) => err.msg));
          setIndicators([]);
          return;
        }

        setIndicators(res.toSorted((a, b) => b.id - a.id));
        indicatorsAmount.current = res.length;
      } else {
        const skip = (resolvedPage - 1) * INDICATORS_PER_PAGE;
        const res = await getObservations({
          ...searchParams,
          skip,
          top: INDICATORS_PER_PAGE,
        });
        setIsLoading(false);
        if (isMonitoringAPIError(res)) {
          setErrors(res.data.map((err) => err.msg));
          setIndicators([]);
          return;
        }

        setIndicators(res.value);
        indicatorsAmount.current = res["@odata.count"];
      }
    };

    prevSearchParamsRef.current = searchParams;
    void fetchIndicators();
  }, [searchParams, resolvedPage, initiativeId]);

  useEffect(() => {
    if (!currentIndicatorId) {
      setCurrentIndicator(null);
      return;
    }

    const fetchIndicatorData = async () => {
      setIsLoading(true);
      setErrors([]);

      const data = await getObservationData(Number(currentIndicatorId));
      if (isMonitoringAPIError(data)) {
        setIsLoading(false);
        setCurrentIndicator(null);
        setErrors(data.data.map((err) => err.msg));
        return;
      }

      const metadata = await getObservationMetadata(data.observationId);
      if (isMonitoringAPIError(metadata)) {
        setIsLoading(false);
        setCurrentIndicator(null);
        setErrors(metadata.data.map((err) => err.msg));
        return;
      }

      if (initiativeId && Number(initiativeId) !== metadata.initiativeId) {
        void navigate(
          `/Monitoreo/Iniciativas/${metadata.initiativeId}/Indicadores/${currentIndicatorId}`,
        );
        return;
      }

      setIsLoading(false);
      setCurrentIndicator({
        ...metadata,
        ...data,
        cleanData: dataTransformFunction[metadata.topic.id](data),
      });
    };

    void fetchIndicatorData();
  }, [currentIndicatorId, navigate, initiativeId]);

  return (
    <IndicatorsContext.Provider
      value={{
        indicators,
        isLoading,
        errors,
        setSearchIndicators: setSearchParams,
        currentIndicator,
        currentPage,
        setCurrentPage,
        indicatorsAmount: indicatorsAmount.current,
      }}
    >
      {children}
    </IndicatorsContext.Provider>
  );
}

export function useIndicatorsCTX() {
  const context = useContext(IndicatorsContext);

  if (!context) {
    throw new Error("useIndicatorsCTX must be used within the IndicatorsCTX");
  }

  return context;
}
