import { Search } from "pages/monitoring/outlets/initiatives/indicators/Search";
import { IndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { Card } from "pages/monitoring/outlets/initiatives/indicators/Card";

export function Indicators() {
  return (
    <IndicatorsCTX>
      <div className="flex flex-col lg:flex-row min-h-full">
        <Search />

        <Card />
      </div>
    </IndicatorsCTX>
  );
}
