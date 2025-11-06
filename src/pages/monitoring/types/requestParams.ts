export interface ODataParams {
  filter?: string;
  select?: string;
  orderby?: `${string} asc` | `${string} desc`;
  top?: number;
  skip?: number;
  expand?: string;
  count?: boolean;
  search?: string;
}

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

// export interface LogEntryFull extends
