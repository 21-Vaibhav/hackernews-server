import type { Post } from "@prisma/client";

export type CreatePostResult = {
  post: Post;
};

export type GetPostsResult = {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
};

export enum CreatePostError {
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum DeletePostError {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
