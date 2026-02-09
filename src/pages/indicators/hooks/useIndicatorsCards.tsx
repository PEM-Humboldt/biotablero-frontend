import { useCallback, useEffect, useState } from "react";
import {
  getIndicators,
  filterIndicators,
} from "pages/indicators/utils/firebase";

export const useIndicatorsCards = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [cards, setCards] = useState<{ id: string }[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  useEffect(() => {
    const indicatorsController = async () => {
      setIsLoadingCards(true);
      try {
        if (filters.length === 0) {
          const indicators = await getIndicators();
          setCards(indicators);
        } else {
          const indicators = await filterIndicators(filters);
          setCards(indicators);
        }
      } catch (err) {
        console.warn("Error fetching indicators:", err);
      } finally {
        setIsLoadingCards(false);
      }
    };

    void indicatorsController();
  }, [filters]);

  const updateCardFilters = useCallback((newFilters: string[]) => {
    setFilters(newFilters);
  }, []);

  return { isLoadingCards, updateCardFilters, cards };
};
