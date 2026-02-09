import { useCallback, useEffect, useState } from "react";
import {
  getIndicators,
  filterIndicators,
} from "pages/indicators/utils/firebase";
import { type CardItem } from "pages/indicators/cardManager/ExpandedCard";

export const useIndicatorsCards = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  useEffect(() => {
    const indicatorsController = async () => {
      setIsLoadingCards(true);
      try {
        if (filters.length === 0) {
          const indicators = await getIndicators();
          // NOTE: aserción temporal mientras se pasa la utilidad de firebase a TS
          setCards(indicators as CardItem[]);
        } else {
          const indicators = await filterIndicators(filters);
          // NOTE: aserción temporal mientras se pasa la utilidad de firebase a TS
          setCards(indicators as CardItem[]);
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
