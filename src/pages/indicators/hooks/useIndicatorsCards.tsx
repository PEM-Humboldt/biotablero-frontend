import { useEffect, useMemo, useState } from "react";
import { getIndicators } from "pages/indicators/utils/firebase";
import type { IndicatorsCardInfo } from "pages/indicators/types/card";

export const useIndicatorsCards = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [allIndicators, setAllIndicators] = useState<IndicatorsCardInfo[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  useEffect(() => {
    const indicatorsController = async () => {
      setIsLoadingCards(true);

      try {
        const indicators = await getIndicators();
        // NOTE: Aserción mientras se pasa el getIndicatos a TS
        setAllIndicators(indicators as IndicatorsCardInfo[]);
      } catch (err) {
        console.warn("Error fetching indicators:", err);
      } finally {
        setIsLoadingCards(false);
      }
    };

    void indicatorsController();
  }, []);

  const renderCards = useMemo(() => {
    if (filters.length === 0) {
      return allIndicators;
    }

    return allIndicators.filter((indicator) =>
      filters.every((filter) => indicator.tags.includes(filter)),
    );
  }, [filters, allIndicators]);

  return { isLoadingCards, setFilters, cards: renderCards };
};
