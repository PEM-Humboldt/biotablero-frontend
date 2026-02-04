import { Request } from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";

export const filterJoinRequestButtonsConfig: FilterJoinRequestSettings[] = [
  {
    label: "Pendientes",
    status: Request.UNDER_REVIEW,
    sortBy: "creationDate",
    newerFirst: false,
  },
  {
    label: "Aprobadas",
    status: Request.APPROVED,
    sortBy: "responseDate",
    newerFirst: false,
  },
  {
    label: "Rechazadas",
    status: Request.REJECTED,
    sortBy: "responseDate",
    newerFirst: false,
  },
];
