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

const REQUESTS_PER_PAGE = 5;

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
    <div className="ml-[60px] bg-[#f5f5f5] p-4 *:max-w-6xl flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Tablero de iniciativas</h3>
      </div>

      <h4>Administración de solicitudes de ingreso</h4>
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
    <>
      <ButtonGroup>
        <Button onClick={() => void requests.pendant()}>pendientes</Button>
        <Button onClick={() => void requests.rejected()}>negadas</Button>
        <Button onClick={() => void requests.approved()}>aprovadas</Button>
      </ButtonGroup>

      {errors.length > 0 && <ErrorsList errorItems={errors} />}

      {requestLists.map((initiative) => (
        <table key={initiative.initiativeId}>
          <caption>Solicitudes a {initiative.initiativeId}</caption>
          <thead>
            <tr>
              {[...joinRequestTable.keys()].map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th>
                {activeFilter.current !== null &&
                [Request.UNDER_REVIEW].includes(activeFilter.current) ? (
                  <span className="sr-only">accion a realizar</span>
                ) : (
                  "responsable"
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {initiative.requests.map((request) => (
              <tr key={request.id}>
                {[...joinRequestTable.values()].map((property, i) => {
                  return (
                    <td key={i}>
                      {formatCellValue(
                        property.value,
                        request,
                        property.callback,
                      )}
                    </td>
                  );
                })}

                <td>
                  {activeFilter.current !== null &&
                  [Request.UNDER_REVIEW].includes(activeFilter.current) ? (
                    <ButtonGroup>
                      <Button>aceptar</Button>
                      <Button>rechazar</Button>
                    </ButtonGroup>
                  ) : (
                    request.reviewerUserName
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}

      <TablePager
        currentPage={currentPage}
        recordsAvailable={0}
        onPageChange={setCurrentPage}
        recordsPerPage={REQUESTS_PER_PAGE}
        paginated={3}
      />
    </>
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
  ["Nombre completo", { value: "userName" }],
  [
    "fecha de creacion",
    {
      value: "creationDate",
      callback: (v: ODataInitiativeUserRequest) =>
        new Date(v.creationDate).toLocaleDateString(),
    },
  ],
]);
