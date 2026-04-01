import type { HasId, ODataResponse } from "@appTypes/odata";
import type {
  JoinRequestStatus,
  UserLevel,
} from "pages/monitoring/types/catalog";
import { ImageObjectTS, VideoObjectTS } from "./territoryStory";

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

interface TerritoryStoryImageObject extends HasId {
  territoryStoryId: number;
  fileUrl: string;
  description: string;
  featuredContent: boolean;
}

interface TerritoryStoryVideoObject extends HasId {
  territoryStoryId: number;
  fileUrl: string;
}

export interface ODataTerritoryStoryObject extends HasId {
  initiativeId: number;
  authorUserName: string;
  title: string;
  text: string;
  keywords: string;
  creationDate: string;
  restricted: boolean;
  enabled: boolean;
  featuredContent: boolean;
  likes: number;
  iLikedIt: boolean;
  images: TerritoryStoryImageObject[];
  videos: TerritoryStoryVideoObject[];
}

export type TerritoryStoryShort = {
  id: number;
  initiativeId: number;
  title: string;
  text: string;
  restricted: boolean;
  enabled: boolean;
  featuredContent: boolean;
  likes: number;

  // NOTE: Hablar con César por si el contenido puede acotarse
  authorUserName: string;
  creationDate: string;
  keywords: string;
  images?: ImageObjectTS[];
  videos?: Omit<VideoObjectTS, "territoryStoryId">[];
};

// NOTE: Etiquetas
interface TagCategory extends HasId {
  id: number;
  name: string;
}

export interface ODataTag extends HasId {
  id: number;
  name: string;
  url?: string;
  category: TagCategory;
  categoryName: string;
}

export interface TagEntryShort extends Omit<ODataTag, "categoryName"> {
  categoryName: string;
}

export type ODataLog = ODataResponse<ODataLogEntryShort>;
export type ODataInitiative = ODataResponse<ODataInitiativeShortEntry>;
export type ODataUserRequest = ODataResponse<ODataInitiativeUserRequest>;
export type ODataUserInfo = ODataResponse<ODataUser>;
export type ODataTerritoryStory = ODataResponse<TerritoryStoryShort>;
export type ODataTagInfo = ODataResponse<ODataTag>;
