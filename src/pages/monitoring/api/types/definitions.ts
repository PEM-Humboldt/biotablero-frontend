import { type InternalAxiosRequestConfig } from "axios";
import { type ODataParams } from "@appTypes/odata";
import type { QueryParams, RequestBody } from "@appTypes/htmlRequest";

export interface ExtendedAxiosReqConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export type RequestData = RequestBody | FormData;

export type ResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

export type MonitoringAPIParams = {
  endpoint: string;
  getStatus?: boolean;
} & (
  | {
      type: "get";
      options?: {
        data?: QueryParams;
        oData?: Partial<ODataParams>;
        headers?: Record<string, string>;
        responseType?: ResponseType;
      };
    }
  | {
      type: "delete";
      options?: {
        data?: QueryParams;
        headers?: Record<string, string>;
        responseType?: ResponseType;
      };
    }
  | {
      type: "put" | "post";
      options?: {
        data?: RequestData;
        headers?: Record<string, string>;
        responseType?: ResponseType;
      };
    }
);

export type ResponseWithStatus<T> = {
  data: T;
  status: number;
};

export type ImageUploadInfo = {
  file: File | null | undefined | string;
  path: string;
};

export type LogTypeValue = {
  id: number;
  name: string;
};
