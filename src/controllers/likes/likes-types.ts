import type { Like } from "@prisma/client";

export type CreateLikeResult = {
  like: Like;
};

export type GetLikesResult = {
  likes: Like[];
  total: number;
  page: number;
  pageSize: number;
};

export enum CreateLikeError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  LIKE_ALREADY_EXISTS = "LIKE_ALREADY_EXISTS",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum LikeOperationError {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
