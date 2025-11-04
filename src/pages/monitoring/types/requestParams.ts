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
  timeStamp: string;
  type: string;
  shortMessage: string;
  userName: string;
};

export type ODataLog = {
  "@odata.count": number;
  value: ODataLogEntry[];
};

export interface LogEntry extends Omit<ODataLogEntry, "timeStamp"> {
  timeStamp: Date;
}
