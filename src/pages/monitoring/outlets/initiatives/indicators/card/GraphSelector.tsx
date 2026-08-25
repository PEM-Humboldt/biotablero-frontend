import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { IndicatorType } from "pages/monitoring/types/indicators";
import { OccupationSpecies } from "pages/monitoring/outlets/initiatives/indicators/card/OccupationSpecies";
import { DetectionProbabilityWithoutCovariables } from "pages/monitoring/outlets/initiatives/indicators/card/DetectionProbabilityWithoutCovariables";
import { SpeciesDiversity } from "pages/monitoring/outlets/initiatives/indicators/card/SpeciesDiversity";
import { RelativeSpeciesUseByGroup } from "pages/monitoring/outlets/initiatives/indicators/card/RelativeSpeciesUseByGroup";
import { RelationalIntensityIndex } from "pages/monitoring/outlets/initiatives/indicators/card/RelationalIntensityIndex";
import { CollectiveActionParticipation } from "pages/monitoring/outlets/initiatives/indicators/card/CollectiveActionParticipation";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useReport } from "@hooks/useReport";
import { useEffect } from "react";

export function GraphSelector() {
  const { currentIndicator } = useIndicatorsCTX();
  const { initiativeInfo } = useInitiativeCTX();
  const { reportContextResolver } = useReport();

  useEffect(() => {
    if (!initiativeInfo) {
      return;
    }
    reportContextResolver(initiativeInfo);
  }, [initiativeInfo, reportContextResolver]);

  if (!currentIndicator) {
    return null;
  }

  switch (currentIndicator.type.id) {
    case IndicatorType.OCCUPATION_SPECIES:
      return <OccupationSpecies />;

    case IndicatorType.DETECTION_PROBABILITY_WITHOUT_COVARIABLES:
      return <DetectionProbabilityWithoutCovariables />;

    case IndicatorType.SPECIES_DIVERSITY:
      return <SpeciesDiversity />;

    case IndicatorType.RELATIVE_SPECIES_USE_BY_GROUP:
      return <RelativeSpeciesUseByGroup />;

    case IndicatorType.RELATIONAL_INTENSITY_INDEX:
      return <RelationalIntensityIndex />;

    case IndicatorType.COLLECTIVE_ACTION_PARTICIPATION:
      return <CollectiveActionParticipation />;
  }
}
