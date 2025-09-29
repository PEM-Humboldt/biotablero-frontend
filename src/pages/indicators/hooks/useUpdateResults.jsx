import { useEffect, useState } from "react";
import {
  getIndicators,
  filterIndicators,
} from "pages/indicators/utils/firebase";

export const useUpdateResults = () => {
  const [filters, setFilters] = useState([]);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (filters.length === 0) {
          const indicators = await getIndicators();
          setResult(indicators);
        } else {
          const indicators = await filterIndicators(filters);
          setResult(indicators);
        }
      } catch (err) {
        console.warn("Error fetching indicators:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return { isLoading, updateFilters, result };
};
