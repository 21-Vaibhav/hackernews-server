import { prismaClient } from "../../extras/prisma.js";
import {
  type CreateCommentResult,
  type GetCommentsResult,
  CreateCommentError,
  CommentOperationError,
} from "./comments-types.js";

export const createComment = async (parameters: {
  userId: string;
  postId: string;
  content: string;
}): Promise<CreateCommentResult> => {
  // First, check if the post exists
  const post = await prismaClient.post.findUnique({
    where: { id: parameters.postId },
  });

  if (!post) {
    throw CreateCommentError.POST_NOT_FOUND;
  }

  try {
    const comment = await prismaClient.comment.create({
      data: {
        content: parameters.content,
        postId: parameters.postId,
        userId: parameters.userId,
      },
    });

    return { comment };
  } catch (error) {
    throw CreateCommentError.UNKNOWN_ERROR;
  }
};

export const getPostComments = async (parameters: {
  postId: string;
  page?: number;
  pageSize?: number;
}): Promise<GetCommentsResult> => {
  const page = parameters.page || 1;
  const pageSize = parameters.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const [comments, total] = await Promise.all([
    prismaClient.comment.findMany({
      where: { postId: parameters.postId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prismaClient.comment.count({ where: { postId: parameters.postId } }),
  ]);

  return {
    comments,
    total,
    page,
    pageSize,
  };
};

export const deleteComment = async (parameters: {
  commentId: string;
  userId: string;
}): Promise<void> => {
  const comment = await prismaClient.comment.findUnique({
    where: { id: parameters.commentId },
  });

  if (!comment) {
    throw CommentOperationError.NOT_FOUND;
  }

  if (comment.userId !== parameters.userId) {
    throw CommentOperationError.UNAUTHORIZED;
  }

  await prismaClient.comment.delete({
    where: { id: parameters.commentId },
  });
};

export const updateComment = async (parameters: {
  commentId: string;
  userId: string;
  content: string;
}): Promise<CreateCommentResult> => {
  const comment = await prismaClient.comment.findUnique({
    where: { id: parameters.commentId },
  });

  if (!comment) {
    throw CommentOperationError.NOT_FOUND;
  }

  if (comment.userId !== parameters.userId) {
    throw CommentOperationError.UNAUTHORIZED;
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id: parameters.commentId },
    data: { content: parameters.content },
  });

  return { comment: updatedComment };
};
