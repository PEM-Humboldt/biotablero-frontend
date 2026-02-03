import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TablePager } from "@composites/TablePager";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import type { ODataParams } from "@appTypes/odata";
import { commonErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { useUserCTX } from "@hooks/UserContext";

import {
  getInitiativeRequests,
  getUserInitiativesInfo,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import type {
  ODataInitiativeUserRequest,
  UserInitiatives,
} from "pages/monitoring/types/requestParams";
import type { GetKeysWithStringValues } from "pages/monitoring/types/monitoring";
import { Ban, SquareCheckBig } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";

const REQUESTS_PER_PAGE = 1;

enum Role {
  LEADER = 1,
  USER = 2,
  VIEWER = 3,
}

enum Request {
  UNDER_REVIEW = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export function InitiativesManagement() {
  const { user } = useUserCTX();
  const [userInitiatives, setUserInitiatives] = useState<
    Partial<Record<Role, UserInitiatives[]>>
  >({});

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    const fetchInitiatives = async () => {
      const initiatives = await getUserInitiativesInfo();

      const initiativesByRole = initiatives.reduce<
        Partial<Record<Role, UserInitiatives[]>>
      >((groups, initiative) => {
        const userInInitiative = initiative.users.find(
          (u) => u.userName === user?.username,
        );
        const roleId = userInInitiative?.level.id ?? 0;

        if (!roleId || !(roleId in Role)) {
          return groups;
        }

        const role = roleId as Role;
        if (!groups[role]) {
          groups[role] = [];
        }
        groups[role].push(initiative);

        return groups;
      }, {});

      setUserInitiatives(initiativesByRole);
    };

    void fetchInitiatives();
  }, [user?.username]);

  return (
    <div className="ml-[60px] bg-[#f5f5f5] p-4 flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Tablero de iniciativas</h3>
      </div>

      <JoinRequests InitiativesAsLeader={userInitiatives[Role.LEADER]} />
    </div>
  );
}

export function JoinRequests({
  InitiativesAsLeader: userInitiatives,
}: {
  InitiativesAsLeader?: UserInitiatives[];
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requestLists, setRequestLists] = useState<
    { initiativeId: number; requests: ODataInitiativeUserRequest[] }[]
  >([]);
  const userSearchParams = useRef<ODataParams>({ top: REQUESTS_PER_PAGE });
  const [errors, setErrors] = useState<string[]>([]);
  const activeFilter = useRef<Request | null>(null);

  const getJoinRequestsByInitiative = useCallback(
    async (id: number, params: ODataParams) => {
      try {
        const res = await getInitiativeRequests(id, params);

        if (isMonitoringAPIError(res)) {
          const { message, status, data } = res;
          setErrors((oldErr) => [
            ...oldErr,
            `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
          ]);
          console.error(res);

          return null;
        }

        return { initiativeId: id, requests: res?.value ?? [] };
      } catch (err) {
        console.error(`Error en iniciativa ${id}:`, err);

        return null;
      }
    },
    [],
  );

  const getAllJoinRequests = useCallback(
    async (
      status: Request,
      sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
      newerFirst: boolean = true,
    ) => {
      if (activeFilter.current === status) {
        activeFilter.current = null;
        setRequestLists([]);
        return;
      }

      if (!userInitiatives || userInitiatives.length === 0) {
        return;
      }

      setCurrentPage(1);
      userSearchParams.current = {
        ...userSearchParams.current,
        skip: 0,
        orderby: `${sortBy} ${newerFirst ? "desc" : "asc"}`,
        filter: `status/id eq ${status}`,
      };

      const results = await Promise.all(
        userInitiatives.map(({ id }) =>
          getJoinRequestsByInitiative(id, userSearchParams.current),
        ),
      );

      const cleanRes = results.filter(
        (r): r is NonNullable<typeof r> => r !== null && r.requests.length > 0,
      );

      activeFilter.current = status;
      setRequestLists(cleanRes);
    },
    [userInitiatives, getJoinRequestsByInitiative],
  );

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

  const requests = useMemo(
    () => ({
      pendant: () =>
        getAllJoinRequests(Request.UNDER_REVIEW, "creationDate", false),
      rejected: () =>
        getAllJoinRequests(Request.REJECTED, "responseDate", true),
      approved: () =>
        getAllJoinRequests(Request.APPROVED, "responseDate", true),
    }),
    [getAllJoinRequests],
  );

  useEffect(() => {
    if (userInitiatives && userInitiatives.length > 0) {
      void requests.pendant();
    }
  }, [userInitiatives, requests]);

  return (
    <div className="bg-background w-full max-w-[600px] rounded-lg p-2 md:p-4 flex flex-col">
      <h4 className="self-start">Solicitudes de ingreso</h4>

      <ButtonGroup className="self-end">
        <Button
          variant="outline"
          className={cn(
            activeFilter.current === Request.UNDER_REVIEW
              ? "bg-primary text-primary-foreground"
              : "",
          )}
          onClick={() => void requests.pendant()}
        >
          Pendientes
        </Button>
        <Button
          variant="outline"
          className={cn(
            activeFilter.current === Request.APPROVED
              ? "bg-primary text-primary-foreground"
              : "",
          )}
          onClick={() => void requests.approved()}
        >
          Aprovadas
        </Button>
        <Button
          variant="outline"
          className={cn(
            activeFilter.current === Request.REJECTED
              ? "bg-primary text-primary-foreground"
              : "",
          )}
          onClick={() => void requests.rejected()}
        >
          Rechazadas
        </Button>
      </ButtonGroup>

      {errors.length > 0 && <ErrorsList errorItems={errors} />}

      {requestLists.map((initiative) => (
        <div className="@container">
          <table
            key={initiative.initiativeId}
            className="mb-2 table-fixed w-full bg-white [&_td,&_th]:px-2 [&_td,&_th]:py-0"
          >
            <caption className="text-left">
              <span className="sr-only">iniciativa </span>
              <span className="font-normal text-base">
                {initiativesDictionary?.[initiative.initiativeId] ??
                  `número${initiative.initiativeId}`}
              </span>
            </caption>
            <thead className="bg-muted/30">
              <tr className="text-primary text-left">
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
                  {activeFilter.current !== null &&
                  [Request.UNDER_REVIEW].includes(activeFilter.current) ? (
                    <span className="sr-only">accion a realizar</span>
                  ) : (
                    "Responsable"
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="[&_tr]:hover:bg-muted">
              {initiative.requests.map((request) => (
                <tr key={request.id} className="h-10!">
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
                    {activeFilter.current !== null &&
                    [Request.UNDER_REVIEW].includes(activeFilter.current) ? (
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
            recordsAvailable={requestLists.length}
            onPageChange={setCurrentPage}
            recordsPerPage={REQUESTS_PER_PAGE}
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
