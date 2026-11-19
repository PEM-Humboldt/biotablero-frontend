import { type ReactNode } from "react";

import type { ODataInitiativeUserRequest } from "pages/monitoring/types/odataResponse";
import { JoinRequestStatus } from "pages/monitoring/types/userJoinRequest";
import { uiText } from "pages/monitoring/outlets/myProfile/joinRequest/layout/uiText";

export function joinRequestTableParams(status: JoinRequestStatus) {
  const isPending = status === JoinRequestStatus.UNDER_REVIEW;

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
              return (
                <div
                  title={`${v.userName} ${cellTitleTxt}`}
                  className="font-normal"
                >
                  {v.userName}
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
