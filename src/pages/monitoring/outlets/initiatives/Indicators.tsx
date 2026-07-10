import { Search } from "pages/monitoring/outlets/initiatives/indicators/Search";
import { IndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { IndicatorCard } from "pages/monitoring/outlets/initiatives/indicators/IndicatorCard";

export function Indicators() {
  return (
    <IndicatorsCTX>
      <div className="flex flex-col lg:flex-row min-h-full">
        <Search />

        <main className="flex-3">
          <IndicatorCard />
        </main>
      </div>
    </IndicatorsCTX>
  );
}
