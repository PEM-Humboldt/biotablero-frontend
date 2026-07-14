import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { IndicatorType } from "pages/monitoring/types/indicators";

export function Graph() {
  const { currentIndicator } = useIndicatorsCTX();

  if (!currentIndicator) {
    return null;
  }

  switch (currentIndicator.type.id) {
    case IndicatorType.OCCUPATION_SPECIES:
      return <div>{currentIndicator.type.name}</div>;

    case IndicatorType.DETECTION_PROBABILITY_WITHOUT_COVARIABLES:
      return <div>{currentIndicator.type.name}</div>;

    case IndicatorType.SPECIES_DIVERSITY:
      return <div>{currentIndicator.type.name}</div>;

    case IndicatorType.RELATIVE_SPECIES_USE_BY_GROUP:
      return <div>{currentIndicator.type.name}</div>;

    case IndicatorType.RELATIONAL_INTENSITY_INDEX:
      return <div>{currentIndicator.type.name}</div>;

    case IndicatorType.COLLECTIVE_ACTION_PARTICIPATION:
      return <div>{currentIndicator.type.name}</div>;
  }
}
