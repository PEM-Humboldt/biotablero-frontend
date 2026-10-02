import {
  type IndicatorContext,
  type IndicatorTag,
  type FetchReportContext,
  ReportType,
} from "@appTypes/report";
import { LOCALE } from "@config/global";
import {
  getInitiativeMonitoringEvents,
  getInitiativeStats,
} from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";
import { makeLocationsString } from "@hooks/useReport/utils/formatters";
import type { SearchState } from "pages/search/hooks/SearchReducer";

export const fetchContext = async (
  reportType: ReportType,
  context: InitiativeCompleteInfo | SearchState | undefined | null,
) => {
  if (!context) {
    return { data: null, errors: ["No report context found"] };
  }

  switch (reportType) {
    case ReportType.MONITORING_INDICATORS:
      return await fetchInitiativeContext(context as InitiativeCompleteInfo);

    case ReportType.SEARCH_INDICATORS:
      return fetchSearchContext(context as SearchState);

    case ReportType.NONE:
    default:
      return { data: null, errors: ["Unknown report type"] };
  }
};

function fetchSearchContext(searchInfo: SearchState): FetchReportContext {
  if (
    !searchInfo.areaType?.label ||
    !searchInfo.areaHa ||
    !searchInfo.areaId?.id
  ) {
    return {
      data: null,
      errors: ["Missing params building Search Report Context"],
    };
  }

  return {
    data: {
      searchType: searchInfo.searchType,
      area: {
        type: searchInfo.areaType.label,
        name: searchInfo.areaId.name,
        polygonId: searchInfo.areaId.id,
        size: searchInfo.areaHa,
        bbox: searchInfo.areaLayer.json.bbox,
      },
      searchUrl: window.location.href,
    },
    errors: [],
  };
}

async function fetchInitiativeContext(
  initiativeInfo: InitiativeCompleteInfo,
): Promise<FetchReportContext> {
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
