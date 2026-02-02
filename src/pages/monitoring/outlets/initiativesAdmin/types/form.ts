export type FormClientValidation<T> = {
  condition: (data: T) => boolean;
  message: string;
  path: string;
};
