import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { SearchInput } from "pages/monitoring/outlets/indicatorsSearch/SearchInput";
import { SearchOutput } from "pages/monitoring/outlets/indicatorsSearch/SearchOutput";
import { IndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";

export function IndicatorsSearch() {
  return (
    <IndicatorsCTX>
      <div className="w-full h-full bg-grey-form">
        <PageTitleUpdater title="Indicadores" />
        <SearchInput />

        <SearchOutput />
      </div>
    </IndicatorsCTX>
  );
}
