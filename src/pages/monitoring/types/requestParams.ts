export type ODataLogEntryShort = {
  id: string;
  timeStamp: string;
  type: string;
  shortMessage: string;
  userName: string;
};

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

export type ODataInitiativeShortEntry = {
  id: number;
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
};

type ODataResponse<T> = {
  "@odata.count": number;
  value: T[];
};

export type ODataLog = ODataResponse<ODataLogEntryShort>;
export type ODataInitiative = ODataResponse<ODataInitiativeShortEntry>;
