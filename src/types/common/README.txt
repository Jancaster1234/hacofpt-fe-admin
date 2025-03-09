/common/ → Holds shared types like enums, pagination, and utility types

For eg:

export type Pagination = {
  page: number;
  pageSize: number;
  totalPages: number;
};

export enum HackathonStatus {
  OPEN = "open",
  CLOSED = "closed",
  IN_PROGRESS = "in_progress",
}

filename convention: camelCase