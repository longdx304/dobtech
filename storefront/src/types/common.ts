export type TResponse<T> = {
  data: T[];
  count: number;
  offset: number;
  limit: number;
};
