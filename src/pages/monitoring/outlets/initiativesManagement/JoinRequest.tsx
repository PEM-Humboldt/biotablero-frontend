import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UserRoundCheck, UserRoundX } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";
import { TablePager } from "@composites/TablePager";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { JOIN_REQUESTS_PER_PAGE } from "@config/monitoring";
import { commonErrorMessage } from "@utils/ui";
import type { GetKeysWithStringValues } from "@appTypes/utils";

import type {
  ODataInitiativeUserRequest,
  UserInInitiative,
} from "pages/monitoring/types/requestParams";
import { useInitiativeJoinRequest } from "pages/monitoring/outlets/initiativesManagement/hooks/useInitiativeJoinRequest";
import {
  type FilterJoinRequestsCallback,
  Request,
} from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";
import { filterJoinRequestButtonsConfig } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/joinRequestFilterButtons";
import { JoinRequestFilterButtons } from "pages/monitoring/outlets/initiativesManagement/joinRequest/JoinRequestFilterButtons";
import { joinRequestTableParams } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/joinRequestTableParams";
import { JoinRequestReviewButtons } from "pages/monitoring/outlets/initiativesManagement/joinRequest/JoinRequestReviewButtons";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/uiText";

export function JoinRequests({
  InitiativesAsLeader: userInitiatives,
}: {
  InitiativesAsLeader?: UserInInitiative[];
}) {
  const [currentStatus, setCurrentStatus] = useState<Request | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requests, setRequests] = useState<ODataInitiativeUserRequest[]>([]);
  const [totalRequest, setTotalRequest] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const initiativesIds = useMemo(
    () => userInitiatives?.map((initiative) => initiative.id) ?? [],
    [userInitiatives],
  );

  const { getRequestPage, resetPool, getTotalRequests, resolveJoinRequest } =
    useInitiativeJoinRequest(initiativesIds);

  const loadData = useCallback(
    async (
      status: Request,
      page: number,
      sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
      newerFirst: boolean,
    ) => {
      setLoading(true);
      setRequests([]);

      try {
        const requestsAmount = await getTotalRequests(status);
        const data = await getRequestPage(
          status,
          page,
          JOIN_REQUESTS_PER_PAGE,
          sortBy,
          newerFirst,
        );

        setRequests(data.requests);
        setErrors(data.errors);
        setTotalRequest(requestsAmount);
      } catch (err) {
        setErrors([uiText.error.critical.user]);
        console.error(uiText.error.critical.console, err);
      } finally {
        setLoading(false);
      }
    },
    [getRequestPage, getTotalRequests],
  );

  const handleFilterChange: FilterJoinRequestsCallback = useCallback(
    async (
      status: Request,
      sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
      newerFirst: boolean = true,
      force: boolean = false,
    ) => {
      if (!force && currentStatus === status) {
        return;
      }

      resetPool();
      setCurrentPage(1);
      setCurrentStatus(status);
      await loadData(status, 1, sortBy, newerFirst);
    },
    [currentStatus, resetPool, loadData],
  );

  const handlePageChange = async (newPage: number) => {
    if (!currentStatus) {
      return;
    }
    setCurrentPage(newPage);

    const isNewerFirst = currentStatus !== Request.UNDER_REVIEW;
    const sortField =
      currentStatus === Request.UNDER_REVIEW ? "creationDate" : "responseDate";

    await loadData(currentStatus, newPage, sortField, isNewerFirst);
  };

  useEffect(() => {
    if (initiativesIds.length > 0 && !currentStatus) {
      void handleFilterChange(Request.UNDER_REVIEW, "creationDate", false);
    }
  }, [initiativesIds, currentStatus, handleFilterChange]);

  const changeJoinRequestStatus = async (
    requestId: number,
    newStatus: "Approved" | "Rejected",
  ) => {
    setErrors([]);
    setLoading(true);

    try {
      const reqError = await resolveJoinRequest(requestId, newStatus);

      if (reqError) {
        const detail =
          reqError && typeof reqError === "object"
            ? `${commonErrorMessage[reqError.status] ?? ""} ${reqError.message ?? reqError.data ?? ""}`
            : "";

        setErrors([
          `${uiText.error.changeJoinRequestStatus}${detail ? `: ${detail}` : "."}`,
        ]);
        return;
      }

      void handleFilterChange(
        Request.UNDER_REVIEW,
        "creationDate",
        false,
        true,
      );
    } catch (err) {
      setErrors([uiText.error.critical.user]);
      console.error(uiText.error.critical.console, err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveJoinRequest = (request: ODataInitiativeUserRequest) => {
    void changeJoinRequestStatus(request.id, "Approved");
    toast(uiText.toast.aproved.title, {
      position: "bottom-right",
      description: uiText.toast.aproved.description(
        request.userName,
        initiativesDictionary?.[request.initiativeId] ??
          String(request.initiativeId),
      ),
      icon: <UserRoundCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
    });
  };

  const handleRejectJoinRequest = (request: ODataInitiativeUserRequest) => {
    void changeJoinRequestStatus(request.id, "Rejected");
    toast(uiText.toast.rejected.title, {
      position: "bottom-right",
      description: uiText.toast.rejected.description(
        request.userName,
        initiativesDictionary?.[request.initiativeId] ??
          String(request.initiativeId),
      ),
      icon: <UserRoundX className="size-8 text-accent" />,
      className: "px-6! gap-6! border-2! border-accent!",
    });
  };

  const initiativesDictionary = useMemo(() => {
    return userInitiatives?.reduce<{ [key: number]: string }>(
      (all, initiative) => {
        all[initiative.id] = initiative.name;
        return all;
      },
      {},
    );
  }, [userInitiatives]);

  const tableStructure = useMemo(() => {
    if (!initiativesDictionary) {
      return new Map<
        string,
        {
          value: keyof ODataInitiativeUserRequest;
          callback?: (v: ODataInitiativeUserRequest) => string;
        }
      >();
    }
    return joinRequestTableParams(initiativesDictionary, currentStatus);
  }, [initiativesDictionary, currentStatus]);

  return (
    <div className="bg-background w-full max-w-[600px] space-y-4 rounded-xl p-2 md:p-4 flex flex-col">
      <div className="flex flex-wrap items-center justify-between bg-muted/50 p-4 rounded-lg">
        <h4 className="m-0! text-primary">{uiText.module.title}</h4>
        <JoinRequestFilterButtons
          currentStatus={currentStatus}
          menuSettings={filterJoinRequestButtonsConfig}
          filteringCallback={handleFilterChange}
        />
      </div>

      <ErrorsList
        className="bg-accent/20 p-4 rounded-lg flex flex-col gap-2"
        errorItems={errors}
      />

      {loading && (
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
              <table className="mb-2 table-fixed w-full bg-white [&_td,&_th]:px-2 [&_td,&_th]:py-0">
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
                      [Request.UNDER_REVIEW].includes(currentStatus) ? (
                        <span className="sr-only">
                          {uiText.module.actionsOnRequest.colTitle}
                        </span>
                      ) : (
                        uiText.module.actionsResolved.colTitle
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody className="[&_tr]:hover:bg-muted [&_td]:py-2!">
                  {requests.map((request) => (
                    <tr key={`${request.initiativeId}_${request.id}`}>
                      {[...tableStructure.values()].map((property, i) => {
                        return (
                          <td
                            key={`${property.value}_${i}`}
                            className={
                              i > 0 ? "hidden @lg:table-cell! text-center" : ""
                            }
                          >
                            {property.callback
                              ? property.callback(request)
                              : property.value}
                          </td>
                        );
                      })}

                      <td className="text-right">
                        {currentStatus !== null &&
                        [Request.UNDER_REVIEW].includes(currentStatus ?? "") ? (
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
                recordsAvailable={totalRequest}
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
