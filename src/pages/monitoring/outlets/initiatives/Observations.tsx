import { Search } from "pages/monitoring/outlets/initiatives/observations/Search";
import { ObservationsCTX } from "pages/monitoring/hooks/useObservationsCTX";
import { Card } from "pages/monitoring/outlets/initiatives/observations/Card";
import { ReportCTX } from "@hooks/useReport";

export function Observations() {
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
