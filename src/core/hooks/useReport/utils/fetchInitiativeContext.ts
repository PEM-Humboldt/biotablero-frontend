import type { IndicatorContext, IndicatorTag } from "@appTypes/report";
import { LOCALE } from "@config/monitoring";
import {
  getInitiativeMonitoringEvents,
  getInitiativeStats,
} from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";
import { makeLocationsString } from "@hooks/useReport/utils/formatters";

type FetchIndicatorContextReturn = {
  data: IndicatorContext | null;
  errors: string[];
};

export async function fetchInitiativeContext(
  initiativeInfo: InitiativeCompleteInfo,
): Promise<FetchIndicatorContextReturn> {
  const [initiativeStats, monitoringEvents] = await Promise.all([
    getInitiativeStats(initiativeInfo.id),
    getInitiativeMonitoringEvents(initiativeInfo.id),
  ]);

  if (isMonitoringAPIError(initiativeStats)) {
    console.error(initiativeStats);
    return {
      data: null,
      errors: initiativeStats.data.map((err) => err.msg),
    };
  }

  if (isMonitoringAPIError(monitoringEvents)) {
    console.error(monitoringEvents);
    return {
      data: null,
      errors: monitoringEvents.data.map((err) => err.msg),
    };
  }

  const tagGroup = { 1: "politicalTags", 2: "socialTags" } as const;

  const { politicalTags, socialTags } = initiativeInfo.tags.reduce<{
    politicalTags: IndicatorTag[];
    socialTags: IndicatorTag[];
  }>(
    (all, current) => {
      const group = tagGroup[current.tag.category.id as keyof typeof tagGroup];

      if (group) {
        all[group].push({
          name: current.tag.name,
          fullName: current.tag?.fullName,
          url: current.tag?.url,
        });
      }

      return all;
    },
    { politicalTags: [], socialTags: [] },
  );

  const contextData: IndicatorContext = {
    initiativeName: initiativeInfo.name,
    initiativeShortName: initiativeInfo.shortName,
    initiativeLocation: makeLocationsString(initiativeInfo.locations),
    initiativeCreationDate: new Date(
      initiativeInfo.creationDate,
    ).toLocaleDateString(LOCALE, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    initiativeDescription: initiativeInfo.description,
    initiativeStats: {
      area: initiativeInfo.polygonArea,
      areaUnit: " ha",
      localitiesUnderMonitoring: initiativeStats.totalMunicipalities,
      monitoringEvents: monitoringEvents.reduce(
        (total, curr) => total + curr.value,
        0,
      ),
    },
    initiativeUrl: `${window.location.origin}/Monitoreo/Iniciativas/${initiativeInfo.id}`,
    politicalTags,
    socialTags,
  };

  return { data: contextData, errors: [] };
}
