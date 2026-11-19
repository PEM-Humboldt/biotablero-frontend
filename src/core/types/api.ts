export type DataError = {
  code: string;
  description: string;
  field?: string;
};

export type ErrorUIMessage = { msg: string; field?: string };

export type ApiRequestError = {
  status: number;
  message: string;
  data: ErrorUIMessage[];
};
