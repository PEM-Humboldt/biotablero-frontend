import { ErrorsList } from "@ui/LabelingWithErrors";
import { parseSimpleMarkdown } from "@utils/textParser";

import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { MonitorignOverviewBars } from "pages/monitoring/outlets/initiativesMap/ui/MonitoringOverviewBars";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";
import { LoadingDiv } from "@ui/LoadingDiv";

export function IndicatorsStats() {
  const { errors, stats, isLoading } = useStats("Indicators");

  const totalIndicators = stats
    ? Object.values(stats).reduce((all, current) => {
        return all + current.reduce((t, c) => t + c.value, 0);
      }, 0)
    : 0;

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />

      <div className="text-balance p-2 [&_p]:mb-0 [&_a]:underline [&_a]:text-primary [&_a]:hover:text-accent">
        {parseSimpleMarkdown(uiText.stats.indicators.preTextMd)}
      </div>

      {stats && stats.observationsByScale.length > 0 ? (
        <>
          <MonitorignOverviewBars
            data={stats.observationsByScale}
            keysForValues={["value"]}
            keyForLeftAxisLabel="key"
            bottomAxisLabel="Personas"
          />

          <div className="text-right text-xl p-4">
            {uiText.stats.indicators.indicatorsAmount(totalIndicators)}
          </div>
        </>
      ) : (
        <div className="bg-primary/10 p-4 rounded-lg">
          {uiText.stats.indicators.noItems}
        </div>
      )}
    </>
  );
}
