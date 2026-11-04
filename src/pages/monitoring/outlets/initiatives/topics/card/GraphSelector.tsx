import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";
import { TopicMetric } from "pages/monitoring/types/topics";
import { OccupationSpecies } from "pages/monitoring/outlets/initiatives/topics/card/OccupationSpecies";
import { DetectionProbabilityWithoutCovariables } from "pages/monitoring/outlets/initiatives/topics/card/DetectionProbabilityWithoutCovariables";
import { SpeciesDiversity } from "pages/monitoring/outlets/initiatives/topics/card/SpeciesDiversity";
import { RelativeSpeciesUseByGroup } from "pages/monitoring/outlets/initiatives/topics/card/RelativeSpeciesUseByGroup";
import { RelationalIntensityIndex } from "pages/monitoring/outlets/initiatives/topics/card/RelationalIntensityIndex";
import { CollectiveActionParticipation } from "pages/monitoring/outlets/initiatives/topics/card/CollectiveActionParticipation";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useReport } from "@hooks/useReport";
import { useEffect } from "react";

export function GraphSelector() {
  const { currentTopic } = useTopicsCTX();
  const { initiativeInfo } = useInitiativeCTX();
  const { reportContextResolver } = useReport();

  useEffect(() => {
    if (!initiativeInfo) {
      return;
    }
    reportContextResolver(initiativeInfo);
  }, [initiativeInfo, reportContextResolver]);

  if (!currentTopic) {
    return null;
  }

<<<<<<< HEAD:src/pages/monitoring/outlets/initiatives/topics/card/GraphSelector.tsx
  switch (currentTopic.topicType.id) {
    case TopicMetric.OCCUPATION_SPECIES:
=======
  switch (currentObservation.topicType.id) {
    case ObservationMetric.OCCUPATION_SPECIES:
>>>>>>> 241dc9bb5 (Updates types naming Observation -> Topic):src/pages/monitoring/outlets/initiatives/observations/card/GraphSelector.tsx
      return <OccupationSpecies />;

    case TopicMetric.DETECTION_PROBABILITY_WITHOUT_COVARIABLES:
      return <DetectionProbabilityWithoutCovariables />;

    case TopicMetric.SPECIES_DIVERSITY:
      return <SpeciesDiversity />;

    case TopicMetric.RELATIVE_SPECIES_USE_BY_GROUP:
      return <RelativeSpeciesUseByGroup />;

    case TopicMetric.RELATIONAL_INTENSITY_INDEX:
      return <RelationalIntensityIndex />;

    case TopicMetric.COLLECTIVE_ACTION_PARTICIPATION:
      return <CollectiveActionParticipation />;
  }
}
