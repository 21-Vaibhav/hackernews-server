import { prismaClient } from "../../extras/prisma.js";
import {
  type CreateLikeResult,
  type GetLikesResult,
  CreateLikeError,
  LikeOperationError,
} from "./likes-types.js";

export const createLike = async (parameters: {
  userId: string;
  postId: string;
}): Promise<CreateLikeResult> => {
  // First, check if the post exists
  const post = await prismaClient.post.findUnique({
    where: { id: parameters.postId },
  });

  if (!post) {
    throw CreateLikeError.POST_NOT_FOUND;
  }

  // Check if like already exists
  const existingLike = await prismaClient.like.findFirst({
    where: {
      postId: parameters.postId,
      userId: parameters.userId,
    },
  });

  if (existingLike) {
    // If like already exists, do nothing
    return { like: existingLike };
  }

  try {
    const like = await prismaClient.like.create({
      data: {
        postId: parameters.postId,
        userId: parameters.userId,
      },
    });

    return { like };
  } catch (error) {
    throw CreateLikeError.UNKNOWN_ERROR;
  }
};

export const getPostLikes = async (parameters: {
  postId: string;
  page?: number;
  pageSize?: number;
}): Promise<GetLikesResult> => {
  const page = parameters.page || 1;
  const pageSize = parameters.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const [likes, total] = await Promise.all([
    prismaClient.like.findMany({
      where: { postId: parameters.postId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prismaClient.like.count({ where: { postId: parameters.postId } }),
  ]);

  return {
    likes,
    total,
    page,
    pageSize,
  };
};

export const deleteLike = async (parameters: {
  postId: string;
  userId: string;
}): Promise<void> => {
  const like = await prismaClient.like.findFirst({
    where: {
      postId: parameters.postId,
      userId: parameters.userId,
    },
  });

  if (!like) {
    throw LikeOperationError.NOT_FOUND;
  }

  await prismaClient.like.delete({
    where: { id: like.id },
  });
};
