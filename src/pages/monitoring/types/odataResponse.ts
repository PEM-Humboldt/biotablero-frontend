import type { HasId, ODataResponse } from "@appTypes/odata";
import type {
  JoinRequestStatus,
  UserLevel,
} from "pages/monitoring/types/catalog";

// NOTE: Logs
export interface ODataLogEntryShort extends HasId {
  timeStamp: string;
  type: string;
  shortMessage: string;
  userName: string;
}

export interface ODataLogEntryFull extends ODataLogEntryShort {
  clientAgent: string;
  clientIp: string;
  customRecord: boolean;
  level: string;
  message: string;
  properties: string;
}

export interface LogEntryShort extends Omit<ODataLogEntryShort, "timeStamp"> {
  timeStamp: Date;
}

export interface LogEntryFull
  extends Omit<ODataLogEntryFull, "timeStamp" | "properties"> {
  timeStamp: Date;
  properties: Record<string, unknown>;
}

// NOTE: Ubicacion
export type LocationBasicInfo = {
  id: number;
  name: string;
  code: string;
  parent?: {
    id: number;
    name: string;
    code: string;
  };
};

export type LocationCompleteInfo = {
  id: number;
  locationId: number;
  locality: string;
  location: LocationBasicInfo;
};

// NOTE: Iniciativas
export interface ODataInitiativeShortEntry extends HasId {
  name: string;
  shortName: string;
  description: string;
  influenceArea?: string;
  objective?: string;
  creationDate: string;
  coordinate: [number, number];
  polygonArea: number;
  enabled: boolean;
  locations: LocationCompleteInfo[];
}

// NOTE: solicitudes

export interface ODataInitiativeUserRequest extends HasId {
  userName: string;
  reviewerUserName: string;
  creationDate: string;
  responseDate: string;
  initiativeId: number;
  status: JoinRequestStatus;
}

// NOTE: Usuarios
interface ODataUser extends HasId {
  email: string;
  emailVerified: boolean;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export type InitiativeUser = {
  id: number;
  initiativeId: number;
  userName: string;
  level: UserLevel;
  creationDate: string;
};

export type UserInInitiative = {
  id: number;
  name: string;
  shortName: string;
  description: string;
  baseline: string;
  objective: string;
  creationDate: string;
  coordinate: [number, number];
  polygonArea: number;
  enabled: boolean;
  users: InitiativeUser[];
};

interface TagCategory extends HasId {
  name: string;
}

export interface ODataTag extends HasId {
  name: string;
  url?: string;
  category: TagCategory;
}

export type ODataLog = ODataResponse<ODataLogEntryShort>;
export type ODataInitiative = ODataResponse<ODataInitiativeShortEntry>;
export type ODataUserRequest = ODataResponse<ODataInitiativeUserRequest>;
export type ODataUserInfo = ODataResponse<ODataUser>;
