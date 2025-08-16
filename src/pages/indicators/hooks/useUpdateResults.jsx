import { useEffect, useState } from "react";
import {
  getIndicators,
  filterIndicators,
} from "pages/indicators/utils/firebase";

const useUpdateResults = () => {
  const [filters, setFilters] = useState([]);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    setIsLoading(true);
    if (filters.length === 0) {
      const indicators = await getIndicators();
      setResult(indicators);
    } else {
      const indicators = await filterIndicators(filters);
      setResult(indicators);
    }
    setIsLoading(false);
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return { loading: isLoading, updateFilters, result };
};

export default useUpdateResults;
