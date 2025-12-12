export type QueryParams = Record<
  string,
  string | number | boolean | (string | number | boolean)[]
>;

export type RequestBody = {
  [key: string]:
    | string
    | string[]
    | number
    | number[]
    | RequestBody
    | RequestBody[];
};
