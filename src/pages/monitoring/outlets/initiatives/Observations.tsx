import { Search } from "pages/monitoring/outlets/initiatives/observations/Search";
import { ObservationsCTX } from "pages/monitoring/hooks/useObservationsCTX";
import { Card } from "pages/monitoring/outlets/initiatives/observations/Card";
import { ReportCTX } from "@hooks/useReport";

export function Observations() {
  return (
    <ReportCTX>
      <ObservationsCTX>
        <div className="bg-grey-light p-4 gap-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]">
          <Search />

          <Card />
        </div>
      </ObservationsCTX>
    </ReportCTX>
  );
}
