import {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useContext,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router";

import type { ODataParams } from "@appTypes/odata";

import type {
  IndicatorData,
  IndicatorMetadata,
} from "pages/monitoring/types/indicators";
import {
  getIndicatorData,
  getIndicatorMetadata,
  getIndicators,
} from "pages/monitoring/api/services/indicators";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { INDICATORS_PER_PAGE } from "@config/monitoring";

type IndicatorsContextValues = {
  indicators: IndicatorMetadata[];
  isLoading: boolean;
  errors: string[];
  currentIndicator: (IndicatorMetadata & IndicatorData) | null;
  searchIndicators: (searchParams: ODataParams) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  indicatorsAmount: number;
};

const IndicatorsContext = createContext<IndicatorsContextValues | null>(null);

export function IndicatorsCTX({ children }: { children: ReactNode }) {
  const { initiativeId, detailItem, indicatorId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    ...(initiativeId
      ? {
          filter: `initiativeId eq ${initiativeId}`,
          top: INDICATORS_PER_PAGE,
        }
      : {}),
  });
  const [indicators, setIndicators] = useState<IndicatorMetadata[]>([]);
  const [currentIndicator, setCurrentIndicator] = useState<
    (IndicatorMetadata & IndicatorData) | null
  >(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const indicatorsAmount = useRef(0);
  const prevSearchParamsRef = useRef(searchParams);

  const currentIndicatorId = detailItem || indicatorId;
  const isNewFilter =
    searchParams.filter !== prevSearchParamsRef.current.filter;
  const resolvedPage = isNewFilter ? 1 : currentPage;

  useEffect(() => {
    const fetchIndicators = async () => {
      setIsLoading(true);
      setErrors([]);

      const skip = (resolvedPage - 1) * INDICATORS_PER_PAGE;
      const res = await getIndicators({ ...searchParams, skip });
      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        setIndicators([]);
        return;
      }

      setIndicators(res.value);
      indicatorsAmount.current = res["@odata.count"];
    };

    void fetchIndicators();
  }, [searchParams, resolvedPage]);

  useEffect(() => {
    if (!currentIndicatorId) {
      setCurrentIndicator(null);
      return;
    }

    const fetchIndicatorData = async () => {
      setIsLoading(true);
      setErrors([]);

      const metadata = await getIndicatorMetadata(Number(currentIndicatorId));
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

      const data = await getIndicatorData(Number(currentIndicatorId));
      if (isMonitoringAPIError(data)) {
        setIsLoading(false);
        setCurrentIndicator(null);
        setErrors(data.data.map((err) => err.msg));
        return;
      }

      setIsLoading(false);
      setCurrentIndicator({ ...metadata, ...data });
    };

    void fetchIndicatorData();
  }, [currentIndicatorId, navigate, initiativeId]);

  const searchIndicators = (params: ODataParams) => {
    setSearchParams((oldParams) => {
      const baseFilter = params.filter || oldParams.filter;
      let finalFilter = baseFilter || "";

      if (initiativeId) {
        finalFilter = baseFilter
          ? `initiativeId eq ${initiativeId} and (${baseFilter})`
          : `initiativeId eq ${initiativeId}`;
      }

      return { ...oldParams, ...params, filter: finalFilter || undefined };
    });
  };

  return (
    <IndicatorsContext.Provider
      value={{
        indicators,
        isLoading,
        errors,
        searchIndicators,
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
