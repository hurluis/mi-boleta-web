import type { PaginationMeta } from "@/domain/value-objects/Pagination";

export type ApiSuccess<T> = {
  data: T;
  meta?: PaginationMeta;
};

export type ApiError = {
  error: string;
};
