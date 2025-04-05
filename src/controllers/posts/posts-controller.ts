import { prismaClient } from "../../extras/prisma.js";
import {
 type CreatePostResult,
 type GetPostsResult,
  CreatePostError,
  DeletePostError,
} from "./posts-types.js";

export const createPost = async (parameters: {
  userId: string;
  content: string;
}): Promise<CreatePostResult> => {
  try {
    const post = await prismaClient.post.create({
      data: {
        content: parameters.content,
        authorId: parameters.userId,
      },
    });

    return { post };
  } catch (error) {
    throw CreatePostError.UNKNOWN_ERROR;
  }
};

export const getAllPosts = async (parameters: {
  page?: number;
  pageSize?: number;
}): Promise<GetPostsResult> => {
  const page = parameters.page || 1;
  const pageSize = parameters.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prismaClient.post.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prismaClient.post.count(),
  ]);

  return {
    posts,
    total,
    page,
    pageSize,
  };
};

export const getUserPosts = async (parameters: {
  userId: string;
  page?: number;
  pageSize?: number;
}): Promise<GetPostsResult> => {
  const page = parameters.page || 1;
  const pageSize = parameters.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prismaClient.post.findMany({
      where: { authorId: parameters.userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prismaClient.post.count({ where: { authorId: parameters.userId } }),
  ]);

  return {
    posts,
    total,
    page,
    pageSize,
  };
};

export const deletePost = async (parameters: {
  postId: string;
  userId: string;
}): Promise<void> => {
  const post = await prismaClient.post.findUnique({
    where: { id: parameters.postId },
  });

  if (!post) {
    throw DeletePostError.NOT_FOUND;
  }

  if (post.authorId !== parameters.userId) {
    throw DeletePostError.UNAUTHORIZED;
  }

  await prismaClient.post.delete({
    where: { id: parameters.postId },
  });
};
