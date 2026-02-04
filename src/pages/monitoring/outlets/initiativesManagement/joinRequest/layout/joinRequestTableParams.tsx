import { type ReactNode } from "react";
import { CornerDownRight } from "lucide-react";

import type { ODataInitiativeUserRequest } from "pages/monitoring/types/requestParams";
import { Request } from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";

export function joinRequestTableParams(
  initiativeNames: { [key: number]: string },
  status: Request | null,
) {
  const isPending = status === Request.UNDER_REVIEW;
  const dateLabel = isPending ? "Fecha de solicitud" : "Fecha de resolución";
  const datePrefix = isPending ? "solicitado el" : "solicitud resuelta el";
  const cellTitleTxt = isPending
    ? "solicita el ingreso a la iniciativa:"
    : "solicitó el ingreso a la iniciativa:";

  return !status
    ? null
    : new Map<
        string,
        {
          value: keyof ODataInitiativeUserRequest;
          callback?: (v: ODataInitiativeUserRequest) => string | ReactNode;
        }
      >([
        [
          "Solicitud",
          {
            value: "userName",
            callback: (v: ODataInitiativeUserRequest) => {
              const initiativeName =
                initiativeNames[v.initiativeId] ?? v.initiativeId;
              return (
                <div title={`${v.userName} ${cellTitleTxt} ${initiativeName}`}>
                  <span className="font-normal">{v.userName}</span>
                  <span className="flex items-center gap-1">
                    <CornerDownRight strokeWidth={1} aria-hidden="true" />
                    <span className="truncate">{initiativeName}</span>
                  </span>
                </div>
              );
            },
          },
        ],
        [
          dateLabel,
          {
            value: "creationDate",
            callback: (v: ODataInitiativeUserRequest) => {
              const renderDate = new Date(v.creationDate).toLocaleDateString();
              const title = `${datePrefix} ${renderDate}`;
              return <div title={title}>{renderDate}</div>;
            },
          },
        ],
      ]);
}
