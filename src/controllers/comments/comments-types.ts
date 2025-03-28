import type { Comment } from "@prisma/client";

export type CreateCommentResult = {
  comment: Comment;
};

export type GetCommentsResult = {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
};

export enum CreateCommentError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum CommentOperationError {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
