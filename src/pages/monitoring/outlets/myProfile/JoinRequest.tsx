import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRoundCheck, UserRoundX } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";
import { TablePager } from "@composites/TablePager";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { JOIN_REQUESTS_PER_PAGE } from "@config/monitoring";
import type { GetKeysWithStringValues } from "@appTypes/utils";

import type { ODataInitiativeUserRequest } from "pages/monitoring/types/odataResponse";
import { JoinRequestStatus } from "pages/monitoring/types/userJoinRequest";
import { filterJoinRequestButtonsConfig } from "pages/monitoring/outlets/myProfile/joinRequest/layout/joinRequestFilterButtons";
import { JoinRequestFilterButtons } from "pages/monitoring/outlets/myProfile/joinRequest/JoinRequestFilterButtons";
import { joinRequestTableParams } from "pages/monitoring/outlets/myProfile/joinRequest/layout/joinRequestTableParams";
import { JoinRequestReviewButtons } from "pages/monitoring/outlets/myProfile/joinRequest/JoinRequestReviewButtons";
import { uiText } from "pages/monitoring/outlets/myProfile/joinRequest/layout/uiText";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { ODataParams } from "@appTypes/odata";
import {
  getInitiativeRequests,
  updateJoinRequest,
} from "pages/monitoring/api/services/initiatives";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

export function JoinRequests({ initiativeId }: { initiativeId: number }) {
  const [currentStatus, setCurrentStatus] = useState<JoinRequestStatus>(
    JoinRequestStatus.UNDER_REVIEW,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requests, setRequests] = useState<ODataInitiativeUserRequest[]>([]);
  const totalRequest = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { reloadUserInMonitoringData } = useUserInMonitoringCTX();
  const { userInitiativesById } = useUserInMonitoringCTX();
  const [requestParams, setRequestParams] = useState<ODataParams>({
    top: JOIN_REQUESTS_PER_PAGE,
    skip: 0,
    orderby: "creationDate desc",
    filter: `status/name eq '${JoinRequestStatus.UNDER_REVIEW}'`,
  });

  const initiativeName = useMemo(
    () =>
      userInitiativesById[initiativeId]
        ? userInitiativesById[initiativeId].name
        : "",
    [initiativeId, userInitiativesById],
  );

  const getRequests = useCallback(async () => {
    setErrors([]);
    setIsLoading(true);

    const res = await getInitiativeRequests(initiativeId, requestParams);
    setIsLoading(false);

    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    totalRequest.current = res["@odata.count"];
    setRequests(res.value);
  }, [initiativeId, requestParams]);

  useEffect(() => {
    void getRequests();
  }, [getRequests]);

  const handleFilterChange = useCallback(
    (
      status: JoinRequestStatus,
      sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
      newerFirst: boolean = true,
    ) => {
      if (currentStatus === status) {
        return;
      }

      setRequestParams((oldParams) => ({
        ...oldParams,
        skip: 0,
        filter: `status/name eq '${status}'`,
        orderby: `${sortBy} ${newerFirst ? "desc" : "asc"}`,
      }));

      setCurrentPage(1);
      setCurrentStatus(status);
    },
    [currentStatus],
  );

  const handlePageChange = (newPage: number) => {
    if (!currentStatus) {
      return;
    }

    const isNewerFirst = currentStatus !== JoinRequestStatus.UNDER_REVIEW;
    const sortField =
      currentStatus === JoinRequestStatus.UNDER_REVIEW
        ? "creationDate"
        : "responseDate";

    setRequestParams((oldParams) => ({
      ...oldParams,
      skip: (newPage - 1) * JOIN_REQUESTS_PER_PAGE,
      orderby: `${sortField} ${isNewerFirst ? "desc" : "asc"}`,
    }));
  };

  const changeJoinRequestStatus = async (
    requestId: number,
    newStatus: "Approved" | "Rejected",
  ) => {
    setErrors([]);

    setIsLoading(true);
    const res = await updateJoinRequest(requestId, newStatus);

    setIsLoading(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    await reloadUserInMonitoringData();
    handleFilterChange(JoinRequestStatus.UNDER_REVIEW, "creationDate");
  };

  const handleApproveJoinRequest = async (
    request: ODataInitiativeUserRequest,
  ) => {
    await changeJoinRequestStatus(request.id, "Approved");
    toast(uiText.toast.aproved.title, {
      position: "bottom-right",
      description: uiText.toast.aproved.description(
        request.userName,
        initiativeName,
      ),
      icon: <UserRoundCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
    });
  };

  const handleRejectJoinRequest = async (
    request: ODataInitiativeUserRequest,
  ) => {
    await changeJoinRequestStatus(request.id, "Rejected");

    toast(uiText.toast.rejected.title, {
      position: "bottom-right",
      description: uiText.toast.rejected.description(
        request.userName,
        initiativeName,
      ),
      icon: <UserRoundX className="size-8 text-accent" />,
      className: "px-6! gap-6! border-2! border-accent!",
    });
  };

  const tableStructure = useMemo(() => {
    return joinRequestTableParams(currentStatus);
  }, [currentStatus]);

  return (
    <div className="w-full space-y-4 p-2 md:p-4 flex flex-col">
      <JoinRequestFilterButtons
        currentStatus={currentStatus}
        menuSettings={filterJoinRequestButtonsConfig}
        filteringCallback={handleFilterChange}
      />

      <ErrorsList
        className="bg-accent/20 p-4 rounded-lg flex flex-col gap-2"
        errorItems={errors}
      />

      {isLoading && (
        <div
          className={cn(
            "bg-primary text-primary-foreground font-normal text-center text-2xl p-4 rounded-lg",
          )}
        >
          {uiText.module.loading}
        </div>
      )}

      {tableStructure !== null && (
        <div className="@container">
          {requests.length === 0 ? (
            <div className="bg-muted text-muted-foreground text-2xl text-center font-normal p-4 rounded-lg">
              {uiText.module.empty}
            </div>
          ) : (
            <>
              <table className="mb-2 table-fixed w-full [&_td,&_th]:px-2 [&_td,&_th]:py-0">
                <thead className="sr-only bg-muted/30">
                  <tr className="text-primary text-left">
                    {[...tableStructure.keys()].map((col, i) => (
                      <th
                        key={col}
                        className={
                          i > 0
                            ? "hidden @lg:table-cell! text-center"
                            : "w-[40%]"
                        }
                      >
                        {col}
                      </th>
                    ))}
                    <th className="text-right w-[20%]">
                      {currentStatus !== null &&
                      [JoinRequestStatus.UNDER_REVIEW].includes(
                        currentStatus,
                      ) ? (
                        <span className="sr-only">
                          {uiText.module.actionsOnRequest.colTitle}
                        </span>
                      ) : (
                        uiText.module.actionsResolved.colTitle
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody className="[&_tr]:hover:bg-background [&_td]:h-10!">
                  {requests.map((request) => (
                    <tr key={`${request.initiativeId}_${request.id}`}>
                      {[...tableStructure.values()].map((property, i) => {
                        return (
                          <td
                            key={`${property.value}_${i}`}
                            className={cn(
                              i > 0 ? "hidden @lg:table-cell! text-center" : "",
                            )}
                          >
                            {property.callback
                              ? property.callback(request)
                              : property.value}
                          </td>
                        );
                      })}

                      <td className="text-right">
                        {currentStatus !== null &&
                        [JoinRequestStatus.UNDER_REVIEW].includes(
                          currentStatus ?? "",
                        ) ? (
                          <JoinRequestReviewButtons
                            request={request}
                            handleApprove={handleApproveJoinRequest}
                            handleReject={handleRejectJoinRequest}
                          />
                        ) : (
                          <div
                            title={uiText.module.actionsResolved.resolvedBy(
                              request.reviewerUserName,
                            )}
                          >
                            {request.reviewerUserName}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <TablePager
                currentPage={currentPage}
                recordsAvailable={totalRequest.current}
                onPageChange={(page: number) => void handlePageChange(page)}
                recordsPerPage={JOIN_REQUESTS_PER_PAGE}
                paginated={null}
                className="pt-2"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
