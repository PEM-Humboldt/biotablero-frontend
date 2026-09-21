import { Search } from "pages/monitoring/outlets/initiatives/indicators/Search";
import { ObservationsCTX } from "pages/monitoring/hooks/useObservationsCTX";
import { Card } from "pages/monitoring/outlets/initiatives/indicators/Card";
import { ReportCTX } from "@hooks/useReport";

export function Indicators() {
  return (
    <ReportCTX>
      <ObservationsCTX>
        <div className="flex flex-col lg:flex-row min-h-full">
          <Search />

          <Card />
        </div>
      </ObservationsCTX>
    </ReportCTX>
  );
}
