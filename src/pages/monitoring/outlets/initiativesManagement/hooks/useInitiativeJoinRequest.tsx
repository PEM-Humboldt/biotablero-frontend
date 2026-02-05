import { useCallback, useRef } from "react";

import type { ODataParams } from "@appTypes/odata";

import type { GetKeysWithStringValues } from "pages/monitoring/types/monitoring";
import type { ODataInitiativeUserRequest } from "pages/monitoring/types/requestParams";
import {
  getInitiativeRequests,
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import type { Request } from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/uiText";

type JoinRequestsPool = {
  initialized: boolean;
  servicesId: number[];
  offset: { [initiativeId: number]: number };
  totalRegisters: { [initiativeId: number]: number };
  localBuffer: { [initiativeId: number]: ODataInitiativeUserRequest[] };
  initiativesPages: Record<string, ODataInitiativeUserRequest[]>;
};

export function useInitiativeJoinRequest(initiativesIds: number[]) {
  const requestsPool = useRef<JoinRequestsPool>({
    initialized: false,
    servicesId: [],
    offset: {},
    totalRegisters: {},
    localBuffer: {},
    initiativesPages: {},
  });

  const getTotalRequests = useCallback(
    async (statusId: Request) => {
      const req = initiativesIds.map((id) => {
        const params: Partial<ODataParams> = {
          top: 0,
          filter: `status/id eq ${statusId}`,
        };

        return getInitiativeRequests(id, params);
      });

      const reqestAmounts = await Promise.all(req);

      return reqestAmounts.reduce(
        (total, current) => total + (current?.["@odata.count"] ?? 0),
        0,
      );
    },
    [initiativesIds],
  );

  const getRequestPage = useCallback(
    async (
      statusId: Request,
      page: number,
      requestsPerPage: number,
      sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
      newerFirst: boolean,
    ) => {
      const pool = requestsPool.current;
      const requestStart = (page - 1) * requestsPerPage;
      const requestEnd = requestStart + requestsPerPage;
      const errors: string[] = [];

      if (!pool.initialized) {
        pool.initialized = true;

        for (const id of initiativesIds) {
          pool.offset[id] = 0;
          pool.totalRegisters[id] = Infinity;
          pool.localBuffer[id] = [];
        }
      }

      if (!pool.initiativesPages[statusId]) {
        pool.initiativesPages[statusId] = [];
      }

      while (pool.initiativesPages[statusId].length < requestEnd) {
        for (const id of initiativesIds) {
          if (
            pool.localBuffer[id].length === 0 &&
            pool.offset[id] < pool.totalRegisters[id]
          ) {
            const params: Partial<ODataParams> = {
              top: requestsPerPage,
              skip: pool.offset[id],
              orderby: `${sortBy} ${newerFirst ? "desc" : "asc"}`,
              filter: `status/id eq ${statusId}`,
            };

            const res = await getInitiativeRequests(id, params);

            if (isMonitoringAPIError(res)) {
              console.error(res);
              errors.push(uiText.error.fetchJoinRequest);
            }

            if (res?.value) {
              pool.totalRegisters[id] = res["@odata.count"];
              pool.offset[id] += res.value.length;
              pool.localBuffer[id].push(...res.value);
            }
          }
        }

        let winnerId: number | null = null;
        let winnerJoinRequest: ODataInitiativeUserRequest | null = null;

        for (const id of initiativesIds) {
          const currentBuffer = pool.localBuffer[id];
          if (currentBuffer.length === 0) {
            continue;
          }

          const candidate = currentBuffer[0];

          const isBetter =
            !winnerJoinRequest ||
            (newerFirst
              ? candidate[sortBy] > winnerJoinRequest[sortBy]
              : candidate[sortBy] < winnerJoinRequest[sortBy]);

          if (isBetter) {
            winnerId = id;
            winnerJoinRequest = candidate;
          }
        }

        if (winnerId) {
          const item = pool.localBuffer[winnerId].shift();
          if (item) {
            pool.initiativesPages[statusId].push(item);
          }
        } else {
          break;
        }
      }

      return {
        requests: pool.initiativesPages[statusId].slice(
          requestStart,
          requestEnd,
        ),
        errors: [],
      };
    },
    [initiativesIds],
  );

  const resetPool = () => {
    requestsPool.current = {
      initialized: false,
      servicesId: [],
      offset: {},
      totalRegisters: {},
      localBuffer: {},
      initiativesPages: {},
    };
  };

  const resolveJoinRequest = async (
    requestId: number,
    newStatus: "Approved" | "Rejected",
  ) => {
    const res = await monitoringAPI({
      type: "post",
      endpoint: `JoinRequest/${requestId}?requestStatus=${newStatus}`,
    });

    if (isMonitoringAPIError(res)) {
      const { message, status, data } = res;
      return [false, { message, status, data }];
    }

    return [true, null];
  };

  return { getRequestPage, resetPool, getTotalRequests, resolveJoinRequest };
}
