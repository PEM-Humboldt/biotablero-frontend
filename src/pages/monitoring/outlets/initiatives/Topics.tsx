import { Search } from "pages/monitoring/outlets/initiatives/topics/Search";
import { TopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";
import { Card } from "pages/monitoring/outlets/initiatives/topics/Card";
import { ReportCTX } from "@hooks/useReport";

export function Topics() {
  return (
    <ReportCTX>
      <TopicsCTX>
        <div className="bg-grey-light p-4 gap-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]">
          <Search />

          <Card />
        </div>
      </TopicsCTX>
    </ReportCTX>
  );
}
