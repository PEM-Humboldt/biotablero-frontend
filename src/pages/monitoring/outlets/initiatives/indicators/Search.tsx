import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { IndicatorSmallCard } from "pages/monitoring/outlets/initiatives/indicators/search/indicatorSmallCard";

export function Search() {
  const { indicators: allInitiativeIndicators } = useIndicatorsCTX();

  return (
    <div className="bg-grey-light flex-1 flex lg:flex-col max-h-60 lg:max-h-screen">
      <div className="flex-1 lg:flex-none lg:aspect-3/2">Buscador</div>

      <div className="flex-1 flex flex-col p-2 gap-4 overflow-auto scrollbar-custom">
        {allInitiativeIndicators.map((indicator) => (
          <IndicatorSmallCard
            key={`smallCartIndicator_${indicator.id}`}
            indicator={indicator}
          />
        ))}
      </div>
    </div>
  );
}
