import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { SearchInput } from "pages/monitoring/outlets/observationsSearch/SearchInput";
import { SearchOutput } from "pages/monitoring/outlets/observationsSearch/SearchOutput";
import { IndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";

export function ObservationsSearch() {
  return (
    <IndicatorsCTX>
      <main className="w-full h-full bg-grey-form">
        <PageTitleUpdater title="Indicadores" />

        <SearchInput />

        <SearchOutput />
      </main>
    </IndicatorsCTX>
  );
}
