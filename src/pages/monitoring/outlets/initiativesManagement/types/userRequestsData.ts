import type { GetKeysWithStringValues } from "@appTypes/utils";

import type { ODataInitiativeUserRequest } from "pages/monitoring/types/requestParams";

export enum Request {
  UNDER_REVIEW = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export type UserRequestData = {
  initiativeId: number;
  userName: string;
  creationDate: Date;
  responseDate: Date | null;
};

export type FilterJoinRequestsCallback = (
  status: Request,
  sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
  newerFirst?: boolean,
  force?: boolean,
) => Promise<void>;

export type FilterJoinRequestSettings = {
  label: string;
  status: Request;
  sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>;
  newerFirst: boolean;
};
