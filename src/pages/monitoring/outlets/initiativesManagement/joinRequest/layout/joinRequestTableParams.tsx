import { type ReactNode } from "react";
import { CornerDownRight } from "lucide-react";

import type { ODataInitiativeUserRequest } from "pages/monitoring/types/odataResponse";
import type { Request } from "pages/monitoring/types/userJoinRequest";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/uiText";

export function joinRequestTableParams(
  initiativeNames: { [key: number]: string },
  status: Request | null,
) {
  const isPending = status === Request.UNDER_REVIEW;
  const dateLabel = isPending
    ? uiText.module.tableParams.dateLabel.pending
    : uiText.module.tableParams.dateLabel.resolved;
  const datePrefix = isPending
    ? uiText.module.tableParams.datePrefix.pending
    : uiText.module.tableParams.datePrefix.resolved;
  const cellTitleTxt = isPending
    ? uiText.module.tableParams.cellTitle.pending
    : uiText.module.tableParams.cellTitle.resolved;

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
