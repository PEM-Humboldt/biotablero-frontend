import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { SearchInput } from "pages/monitoring/outlets/observationsSearch/SearchInput";
import { SearchOutput } from "pages/monitoring/outlets/observationsSearch/SearchOutput";
import { ObservationsCTX } from "pages/monitoring/hooks/useObservationsCTX";

export function ObservationsSearch() {
  return (
    <ObservationsCTX>
      <main className="w-full h-full bg-grey-form">
        <PageTitleUpdater title="Indicadores" />

        <SearchInput />

        <SearchOutput />
      </main>
    </ObservationsCTX>
  );
}
