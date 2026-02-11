import { useCallback, useEffect, useState } from "react";
import {
  getIndicators,
  filterIndicators,
} from "pages/indicators/utils/firebase";
import type { IndicatorsCardInfo } from "pages/indicators/types/card";

export const useIndicatorsCards = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [cards, setCards] = useState<IndicatorsCardInfo[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  useEffect(() => {
    const indicatorsController = async () => {
      setIsLoadingCards(true);
      try {
        if (filters.length === 0) {
          const indicators = await getIndicators();
          // NOTE: aserción temporal mientras se pasa la utilidad de firebase a TS
          setCards(indicators as IndicatorsCardInfo[]);
        } else {
          const indicators = await filterIndicators(filters);
          // NOTE: aserción temporal mientras se pasa la utilidad de firebase a TS
          setCards(indicators as IndicatorsCardInfo[]);
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
