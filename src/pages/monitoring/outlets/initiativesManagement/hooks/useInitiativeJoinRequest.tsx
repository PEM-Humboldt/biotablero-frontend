import { useCallback, useRef } from "react";

import type { ODataParams } from "@appTypes/odata";

import type { GetKeysWithStringValues } from "pages/monitoring/types/monitoring";
import type { ODataInitiativeUserRequest } from "pages/monitoring/types/requestParams";
import { getInitiativeRequests } from "pages/monitoring/api/monitoringAPI";
import type { Request } from "pages/monitoring/outlets/initiativesManagement/types/userRequestsData";

type JoinRequestsPool = {
  initialized: boolean;
  servicesId: number[];
  offset: { [initiativeId: number]: number };
  totalRegisters: { [initiativeId: number]: number };
  localBuffer: { [initiativeId: number]: ODataInitiativeUserRequest[] };
  initiativesPages: Record<string, ODataInitiativeUserRequest[]>;
};

const JOIN_REQUESTS_BUFFER_SIZE = 20;

export function useInitiativeJoinRequest(initiativesIds: number[]) {
  const requestsPool = useRef<JoinRequestsPool>({
    initialized: false,
    servicesId: [],
    offset: {},
    totalRegisters: {},
    localBuffer: {},
    initiativesPages: {},
  });

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
              top: JOIN_REQUESTS_BUFFER_SIZE,
              skip: pool.offset[id],
              orderby: `${sortBy} ${newerFirst ? "desc" : "asc"}`,
              filter: `status/id eq ${statusId}`,
            };

            const res = await getInitiativeRequests(id, params);

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
      return pool.initiativesPages[statusId].slice(requestStart, requestEnd);
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

  return { getRequestPage, resetPool };
}
