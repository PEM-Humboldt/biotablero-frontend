import {
  createContext,
  useState,
  type ReactNode,
  useMemo,
  useEffect,
} from "react";
import type {
  IndicatorData,
  IndicatorMetadata,
} from "pages/monitoring/types/indicators";
import type { ODataParams } from "@appTypes/odata";
import { useParams } from "react-router";
import {
  getIndicatorData,
  getIndicators,
} from "pages/monitoring/api/services/indicators";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

type IndicatorsContextValues = {
  indicators: IndicatorMetadata[];
  isLoading: boolean;
  errors: string[];
  currentIndicator: (IndicatorMetadata & IndicatorData) | null;
  searchIndicators: (searchParams: ODataParams) => void;
};

const IndicatorsContext = createContext<IndicatorsContextValues | null>(null);
export const INDICATORS_PER_PAGE = 5;

export function IndicatorsCTX({ children }: { children: ReactNode }) {
  const { initiativeId, detailItem, indicatorId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    ...(initiativeId
      ? {
          top: INDICATORS_PER_PAGE,
          filter: `initiativeId eq ${initiativeId}`,
          orderby: "creationDate desc",
        }
      : {}),
  });
  const [indicators, setIndicators] = useState<IndicatorMetadata[]>([]);
  const [currentIndicatorData, setCurrentIndicatorData] =
    useState<IndicatorData | null>(null);

  const currentIndicatorId = detailItem || indicatorId;

  useEffect(() => {
    const fetchIndicators = async () => {
      setIsLoading(true);
      setErrors([]);

      const res = await getIndicators(searchParams);
      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        setIndicators([]);
        return;
      }

      setIndicators(res.value);
    };

    void fetchIndicators();
  }, [searchParams]);

  useEffect(() => {
    if (!currentIndicatorId) {
      setCurrentIndicatorData(null);
      return;
    }

    const fetchIndicatorData = async () => {
      setIsLoading(true);
      setErrors([]);
      const res = await getIndicatorData(Number(currentIndicatorId));

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setCurrentIndicatorData(null);
        setErrors(res.data.map((err) => err.msg));
        return;
      }
      setCurrentIndicatorData(res);
    };

    void fetchIndicatorData();
  }, [currentIndicatorId]);

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

  const currentIndicator = useMemo(() => {
    if (!currentIndicatorId || !currentIndicatorData) {
      return null;
    }

    const metadata = indicators.find(
      (i) => i.id === Number(currentIndicatorId),
    );
    if (!metadata) {
      return null;
    }

    return { ...metadata, ...currentIndicatorData };
  }, [currentIndicatorId, indicators, currentIndicatorData]);

  return (
    <IndicatorsContext.Provider
      value={{
        indicators,
        isLoading,
        errors,
        searchIndicators,
        currentIndicator,
      }}
    >
      {children}
    </IndicatorsContext.Provider>
  );
}
