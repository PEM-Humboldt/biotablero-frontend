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

export type ODataLog = {
  "@odata.count": number;
  value: ODataLogEntryShort[];
};

export interface LogEntryShort extends Omit<ODataLogEntryShort, "timeStamp"> {
  timeStamp: Date;
}

export interface LogEntryFull
  extends Omit<ODataLogEntryFull, "timeStamp" | "properties"> {
  timeStamp: Date;
  properties: Record<string, unknown>;
}

type ODataInitiativeLocation = {
  id: number;
  locationId: number;
  locality: string;
  location: {
    id: number;
    name: string;
    code: string;
  };
};

export type ODataInitiativeList = {
  id: number;
  name: string;
  description: string;
  creationDate: string;
  coordinate: [number, number];
  polygonArea: number;
  enabled: boolean;
  locations: ODataInitiativeLocation[];
};
