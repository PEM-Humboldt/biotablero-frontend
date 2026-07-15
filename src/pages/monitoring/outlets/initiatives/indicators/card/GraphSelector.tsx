import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { IndicatorType } from "pages/monitoring/types/indicators";
import { OccupationSpecies } from "pages/monitoring/outlets/initiatives/indicators/card/OccupationSpecies";
import { DetectionProbabilityWithoutCovariables } from "pages/monitoring/outlets/initiatives/indicators/card/DetectionProbabilityWithoutCovariables";

export function GraphSelector() {
  const { currentIndicator } = useIndicatorsCTX();

  if (!currentIndicator) {
    return null;
  }

  switch (currentIndicator.type.id) {
    case IndicatorType.OCCUPATION_SPECIES:
      return <OccupationSpecies />;

    case IndicatorType.DETECTION_PROBABILITY_WITHOUT_COVARIABLES:
      return <DetectionProbabilityWithoutCovariables />;

    case IndicatorType.SPECIES_DIVERSITY:
      return <div>{JSON.stringify(currentIndicator.cleanData, null, 2)}</div>;

    case IndicatorType.RELATIVE_SPECIES_USE_BY_GROUP:
      return <div>{JSON.stringify(currentIndicator.cleanData, null, 2)}</div>;

    case IndicatorType.RELATIONAL_INTENSITY_INDEX:
      return <div>{JSON.stringify(currentIndicator.cleanData, null, 2)}</div>;

    case IndicatorType.COLLECTIVE_ACTION_PARTICIPATION:
      return <div>{JSON.stringify(currentIndicator.cleanData, null, 2)}</div>;
  }
}
