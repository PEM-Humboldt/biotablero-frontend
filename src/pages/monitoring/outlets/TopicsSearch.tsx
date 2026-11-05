import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { SearchInput } from "pages/monitoring/outlets/topicsSearch/SearchInput";
import { SearchOutput } from "pages/monitoring/outlets/topicsSearch/SearchOutput";
import { TopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";

export function TopicsSearch() {
  return (
    <TopicsCTX>
      <main className="w-full h-full bg-grey-form">
        <PageTitleUpdater title="Indicadores" />

        <SearchInput />

        <SearchOutput />
      </main>
    </TopicsCTX>
  );
}
