import { useObservationsCTX } from "pages/monitoring/hooks/useObservationsCTX";
import { ObservationMetric } from "pages/monitoring/types/observations";
import { OccupationSpecies } from "pages/monitoring/outlets/initiatives/observations/card/OccupationSpecies";
import { DetectionProbabilityWithoutCovariables } from "pages/monitoring/outlets/initiatives/observations/card/DetectionProbabilityWithoutCovariables";
import { SpeciesDiversity } from "pages/monitoring/outlets/initiatives/observations/card/SpeciesDiversity";
import { RelativeSpeciesUseByGroup } from "pages/monitoring/outlets/initiatives/observations/card/RelativeSpeciesUseByGroup";
import { RelationalIntensityIndex } from "pages/monitoring/outlets/initiatives/observations/card/RelationalIntensityIndex";
import { CollectiveActionParticipation } from "pages/monitoring/outlets/initiatives/observations/card/CollectiveActionParticipation";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useReport } from "@hooks/useReport";
import { useEffect } from "react";

export function GraphSelector() {
  const { currentObservation } = useObservationsCTX();
  const { initiativeInfo } = useInitiativeCTX();
  const { reportContextResolver } = useReport();

  useEffect(() => {
    if (!initiativeInfo) {
      return;
    }
    reportContextResolver(initiativeInfo);
  }, [initiativeInfo, reportContextResolver]);

  if (!currentObservation) {
    return null;
  }

  switch (currentObservation.topic.id) {
    case ObservationMetric.OCCUPATION_SPECIES:
      return <OccupationSpecies />;

    case ObservationMetric.DETECTION_PROBABILITY_WITHOUT_COVARIABLES:
      return <DetectionProbabilityWithoutCovariables />;

    case ObservationMetric.SPECIES_DIVERSITY:
      return <SpeciesDiversity />;

    case ObservationMetric.RELATIVE_SPECIES_USE_BY_GROUP:
      return <RelativeSpeciesUseByGroup />;

    case ObservationMetric.RELATIONAL_INTENSITY_INDEX:
      return <RelationalIntensityIndex />;

    case ObservationMetric.COLLECTIVE_ACTION_PARTICIPATION:
      return <CollectiveActionParticipation />;
  }
}
