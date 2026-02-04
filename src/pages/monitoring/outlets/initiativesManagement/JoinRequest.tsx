import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, SquareCheckBig } from "lucide-react";

import { TablePager } from "@composites/TablePager";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";
import { JOIN_REQUESTS_PER_PAGE } from "@config/monitoring";

import type {
  ODataInitiativeUserRequest,
  UserInitiatives,
} from "pages/monitoring/types/requestParams";
import type { GetKeysWithStringValues } from "pages/monitoring/types/monitoring";
import { useInitiativeJoinRequest } from "pages/monitoring/outlets/initiativesManagement/hooks/useInitiativeJoinRequest";
import { Request } from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";

export function JoinRequests({
  InitiativesAsLeader: userInitiatives,
}: {
  InitiativesAsLeader?: UserInitiatives[];
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requests, setRequests] = useState<ODataInitiativeUserRequest[]>([]);
  const [totalRequest, setTotalRequest] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<Request | null>(null);

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

  const handleFilterChange = useCallback(
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

  const initiativesDictionary = useMemo(() => {
    return userInitiatives?.reduce<{ [key: number]: string }>(
      (all, initiative) => {
        all[initiative.id] = initiative.name;
        return all;
      },
      {},
    );
  }, [userInitiatives]);

  const requestsStatus = useMemo(
    () => ({
      pendant: () =>
        handleFilterChange(Request.UNDER_REVIEW, "creationDate", false),
      rejected: () =>
        handleFilterChange(Request.REJECTED, "responseDate", true),
      approved: () =>
        handleFilterChange(Request.APPROVED, "responseDate", true),
    }),

    [handleFilterChange],
  );

  const handleAproveJoinRequest = (requestId: number) => {
    console.log(requestId);
  };

  const handleRejectJoinRequest = (requestId: number) => {
    console.log(requestId);
  };

  return (
    <div className="bg-background w-full max-w-[600px] rounded-lg p-2 md:p-4 flex flex-col">
      <h4 className="self-start">Solicitudes de ingreso</h4>

      <ButtonGroup className="self-end">
        <Button
          variant="outline"
          className={cn(
            currentStatus === Request.UNDER_REVIEW
              ? "bg-primary text-primary-foreground"
              : "",
          )}
          onClick={() => void requestsStatus.pendant()}
        >
          Pendientes
        </Button>
        <Button
          variant="outline"
          className={cn(
            currentStatus === Request.APPROVED
              ? "bg-primary text-primary-foreground"
              : "",
          )}
          onClick={() => void requestsStatus.approved()}
        >
          Aprovadas
        </Button>
        <Button
          variant="outline"
          className={cn(
            currentStatus === Request.REJECTED
              ? "bg-primary text-primary-foreground"
              : "",
          )}
          onClick={() => void requestsStatus.rejected()}
        >
          Rechazadas
        </Button>
      </ButtonGroup>

      {errors.length > 0 && <ErrorsList errorItems={errors} />}
      {loading && <div>cargando</div>}

      {requests.map((initiative) => (
        <div className="@container" key={initiative.initiativeId}>
          <table className="mb-2 table-fixed w-full bg-white [&_td,&_th]:px-2 [&_td,&_th]:py-0">
            <thead className="bg-muted/30">
              <tr className="text-primary text-left">
                <th>Iniciativa</th>
                {[...joinRequestTable.keys()].map((col, i) => (
                  <th
                    key={col}
                    className={
                      i > 0 ? "hidden @lg:table-cell! text-center" : ""
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
                <tr key={request.id} className="h-10!">
                  <td>
                    <span className="sr-only">iniciativa </span>
                    <span className="font-normal text-base">
                      {initiativesDictionary?.[initiative.initiativeId] ??
                        `número${initiative.initiativeId}`}
                    </span>
                  </td>
                  {[...joinRequestTable.values()].map((property, i) => {
                    return (
                      <td
                        key={i}
                        className={
                          i > 0 ? "hidden @lg:table-cell! text-center" : ""
                        }
                      >
                        {formatCellValue(
                          property.value,
                          request,
                          property.callback,
                        )}
                      </td>
                    );
                  })}

                  <td className="text-right">
                    {currentStatus !== null &&
                    [Request.UNDER_REVIEW].includes(currentStatus) ? (
                      <ButtonGroup className="flex justify-end w-full">
                        <Button
                          size="icon"
                          variant="ghost-clean"
                          title="aceptar solicitud"
                          onClick={() =>
                            void handleAproveJoinRequest(request.id)
                          }
                        >
                          <span className="sr-only">aceptar solicitud</span>
                          <SquareCheckBig
                            aria-hidden="true"
                            className="size-5"
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost-clean"
                          title="rechazar solicitud"
                          onClick={() =>
                            void handleRejectJoinRequest(request.id)
                          }
                        >
                          <span className="sr-only">rechazar solicitud</span>
                          <Ban aria-hidden="true" className="size-5" />
                        </Button>
                      </ButtonGroup>
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
      ))}
    </div>
  );
}

function formatCellValue(
  row: keyof ODataInitiativeUserRequest,
  value: ODataInitiativeUserRequest,
  callback?: (v: ODataInitiativeUserRequest) => string,
): string {
  if (callback) {
    return callback(value);
  }

  if (value[row] && typeof value[row] === "object") {
    console.error(
      "Provide a callback or make sure the value is a string o number",
    );
    return "---";
  }

  return String(value[row]);
}

const joinRequestTable = new Map<
  string,
  {
    value: keyof ODataInitiativeUserRequest;
    callback?: (v: ODataInitiativeUserRequest) => string;
  }
>([
  ["Nombre de usuario", { value: "userName" }],
  [
    "fecha solicitud",
    {
      value: "creationDate",
      callback: (v: ODataInitiativeUserRequest) =>
        new Date(v.creationDate).toLocaleDateString(),
    },
  ],
]);
