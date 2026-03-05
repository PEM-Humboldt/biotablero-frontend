import {
  type FilterJoinRequestSettings,
  JoinRequestStatus,
} from "pages/monitoring/types/userJoinRequest";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/uiText";

export const filterJoinRequestButtonsConfig: FilterJoinRequestSettings[] = [
  {
    label: uiText.module.filteringLabels.underReview,
    status: JoinRequestStatus.UNDER_REVIEW,
    sortBy: "creationDate",
    newerFirst: false,
  },
  {
    label: uiText.module.filteringLabels.aproved,
    status: JoinRequestStatus.APPROVED,
    sortBy: "responseDate",
    newerFirst: true,
  },
  {
    label: uiText.module.filteringLabels.rejected,
    status: JoinRequestStatus.REJECTED,
    sortBy: "responseDate",
    newerFirst: true,
  },
];
