import { useCallback, useEffect, useMemo, useState } from "react";

import { TablePager } from "@composites/TablePager";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { JOIN_REQUESTS_PER_PAGE } from "@config/monitoring";

import type {
  ODataInitiativeUserRequest,
  UserInitiatives,
} from "pages/monitoring/types/requestParams";
import type { GetKeysWithStringValues } from "pages/monitoring/types/monitoring";
import { useInitiativeJoinRequest } from "pages/monitoring/outlets/initiativesManagement/hooks/useInitiativeJoinRequest";
import {
  type FilterJoinRequestsCallback,
  Request,
} from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";
import { filterJoinRequestButtonsConfig } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/joinRequestFilterButtons";
import { JoinRequestFilterButtons } from "pages/monitoring/outlets/initiativesManagement/joinRequest/JoinRequestFilterButtons";
import { joinRequestTableParams } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/joinRequestTableParams";
import { JoinRequestReviewButtons } from "pages/monitoring/outlets/initiativesManagement/joinRequest/JoinRequestReviewButtons";

export function JoinRequests({
  InitiativesAsLeader: userInitiatives,
}: {
  InitiativesAsLeader?: UserInitiatives[];
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

  const { getRequestPage, resetPool, getTotalRequests } =
    useInitiativeJoinRequest(initiativesIds);

  const loadData = useCallback(
    async (
      status: Request,
      page: number,
      sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
      newerFirst: boolean,
    ) => {
      setLoading(true);
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
        setErrors((prev) => [...prev, "Error cargando solicitudes"]);
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
    ) => {
      if (currentStatus === status) {
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

  const handleAproveJoinRequest = (requestId: number) => {
    console.log(requestId);
  };

  const handleRejectJoinRequest = (requestId: number) => {
    console.log(requestId);
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
    <div className="bg-background w-full max-w-[600px] rounded-lg p-2 md:p-4 flex flex-col">
      <h4 className="self-start">Solicitudes de ingreso</h4>

      {errors.length > 0 && <ErrorsList errorItems={errors} />}
      {loading && <div>cargando</div>}

      <JoinRequestFilterButtons
        currentStatus={currentStatus}
        menuSettings={filterJoinRequestButtonsConfig}
        filteringCallback={handleFilterChange}
      />

      {tableStructure !== null && (
        <div className="@container">
          <table className="mb-2 table-fixed w-full bg-white [&_td,&_th]:px-2 [&_td,&_th]:py-0">
            <thead className="bg-muted/30">
              <tr className="text-primary text-left">
                {[...tableStructure.keys()].map((col, i) => (
                  <th
                    key={col}
                    className={
                      i > 0 ? "hidden @lg:table-cell! text-center" : "w-[40%]"
                    }
                  >
                    {col}
                  </th>
                ))}
                <th className="text-right w-[25%]">
                  {currentStatus !== null &&
                  [Request.UNDER_REVIEW].includes(currentStatus) ? (
                    <span className="sr-only">accion a realizar</span>
                  ) : (
                    "Responsable"
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="[&_tr]:hover:bg-muted">
              {requests.map((request) => (
                <tr
                  key={`${request.initiativeId}_${request.id}`}
                  className="h-10!"
                >
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
                        requestId={request.id}
                        handleApprove={handleAproveJoinRequest}
                        handleReject={handleRejectJoinRequest}
                      />
                    ) : (
                      request.reviewerUserName
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
            paginated={3}
          />
        </div>
      )}
    </div>
  );
}
