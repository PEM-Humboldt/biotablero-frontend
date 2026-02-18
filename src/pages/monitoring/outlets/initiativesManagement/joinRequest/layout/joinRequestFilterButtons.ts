import {
  type FilterJoinRequestSettings,
  Request,
} from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/uiText";

export const filterJoinRequestButtonsConfig: FilterJoinRequestSettings[] = [
  {
    label: uiText.module.filteringLabels.underReview,
    status: Request.UNDER_REVIEW,
    sortBy: "creationDate",
    newerFirst: false,
  },
  {
    label: uiText.module.filteringLabels.aproved,
    status: Request.APPROVED,
    sortBy: "responseDate",
    newerFirst: false,
  },
  {
    label: uiText.module.filteringLabels.rejected,
    status: Request.REJECTED,
    sortBy: "responseDate",
    newerFirst: false,
  },
];
