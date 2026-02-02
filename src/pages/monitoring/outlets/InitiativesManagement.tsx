import { useCallback, useEffect, useRef, useState } from "react";

import { TablePager } from "@composites/TablePager";
import { Button } from "@ui/shadCN/component/button";
import type { ODataParams } from "@appTypes/odata";
import { commonErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";

import {
  getInitiativeRequests,
  getUserInitiativesInfo,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import type {
  ODataInitiativeUserRequest,
  UserInitiatives,
} from "pages/monitoring/types/requestParams";

const REQUESTS_PER_PAGE = 5;

export function InitiativesManagement() {
  const [userInitiatives, setUserInitiatives] = useState<UserInitiatives[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requests, setRequests] = useState<
    { id: number; requests: ODataInitiativeUserRequest[] }[]
  >([]);
  const userSearchParams = useRef<ODataParams>({ top: REQUESTS_PER_PAGE });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const initiatives = await getUserInitiativesInfo();
      setUserInitiatives(initiatives);
    };
    void init();
  }, []);

  const fetchInitiativeUserRequests = useCallback(
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
        return { id, requests: res?.value ?? [] };
      } catch (err) {
        console.error(`Error en iniciativa ${id}:`, err);
        return null;
      }
    },
    [],
  );

  const fetchAllUserRequest = useCallback(
    async (
      status: "UnderReview" | "Approved" | "Rejected",
      newerFirst: boolean = true,
    ) => {
      setCurrentPage(1);

      userSearchParams.current = {
        ...userSearchParams.current,
        skip: 0,
        top: REQUESTS_PER_PAGE,
        orderby: `creationDate ${newerFirst ? "desc" : "asc"}`,
        filter: `status/name eq '${status}'`,
      };

      const results = await Promise.all(
        userInitiatives.map(({ id }) =>
          fetchInitiativeUserRequests(id, userSearchParams.current),
        ),
      );

      const cleanRes = results.filter(
        (r): r is NonNullable<typeof r> => r !== null && r.requests.length > 0,
      );

      setRequests(cleanRes);
    },
    [userInitiatives, fetchInitiativeUserRequests],
  );

  const viewPendant = useCallback(
    () => fetchAllUserRequest("UnderReview", true),
    [fetchAllUserRequest],
  );

  const viewRejected = useCallback(
    () => fetchAllUserRequest("Rejected", true),
    [fetchAllUserRequest],
  );

  const viewApproved = useCallback(
    () => fetchAllUserRequest("Approved", true),
    [fetchAllUserRequest],
  );

  useEffect(() => {
    if (userInitiatives.length > 0) {
      void viewPendant();
    }
  }, [userInitiatives, viewPendant]);

  return (
    <div className="ml-[60px] bg-[#f5f5f5] p-4 *:max-w-6xl flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Nuevos miembros de la iniciativa</h3>
      </div>

      <div>
        <Button onClick={() => void viewPendant()}>pendientes</Button>
        <Button onClick={() => void viewRejected()}>negadas</Button>
        <Button onClick={() => void viewApproved()}>Antiguas</Button>
        {errors.length > 0 && <ErrorsList errorItems={errors} />}
        {requests.map((r) => (
          <>
            <h4>Solicitudes a {r.id}</h4>
            <ul>
              {r.requests.map((z) => (
                <li>{z.userName}</li>
              ))}
            </ul>
          </>
        ))}
      </div>

      <TablePager
        currentPage={currentPage}
        recordsAvailable={0}
        onPageChange={setCurrentPage}
        recordsPerPage={REQUESTS_PER_PAGE}
        paginated={3}
      />
    </div>
  );
}
