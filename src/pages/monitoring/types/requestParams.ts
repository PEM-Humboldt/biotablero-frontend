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

export type ODataLogEntry = {
  id: string;
  level: string;
  message: string;
  timeStamp: string;
  type: string;
  userName: string;
  clientIp: string;
  clientAgent: string;
  customRecord: boolean;
  properties: string;
};

export type ODataLog = {
  "@odata.count": number;
  value: ODataLogEntry[];
};

export interface LogEntry
  extends Omit<ODataLogEntry, "timeStamp" | "properties"> {
  timeStamp: Date;
  properties: Record<string, unknown>;
}
