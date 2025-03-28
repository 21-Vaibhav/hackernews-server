import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares.ts/token-middleware";
import {
  createComment,
  getPostComments,
  deleteComment,
  updateComment,
} from "../controllers/comments/comments-controller";
import {
  CreateCommentError,
  CommentOperationError,
} from "../controllers/comments/comments-types";

export const commentsRoutes = new Hono();

// Get comments on a post
commentsRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
  const { postId } = context.req.param();
  const page = Number(context.req.query("page")) || 1;
  const pageSize = Number(context.req.query("pageSize")) || 10;

  try {
    const result = await getPostComments({ postId, page, pageSize });
    return context.json({ data: result }, 200);
  } catch (e) {
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Create a comment on a post
commentsRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { postId } = context.req.param();
  const { content } = await context.req.json();

  try {
    const result = await createComment({ userId, postId, content });
    return context.json({ data: result }, 201);
  } catch (e) {
    if (e === CreateCommentError.POST_NOT_FOUND) {
      return context.json({ message: "Post not found" }, 404);
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Delete a comment
commentsRoutes.delete("/:commentId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { commentId } = context.req.param();

  try {
    await deleteComment({ commentId, userId });
    return context.json({ message: "Comment deleted successfully" }, 200);
  } catch (e) {
    if (e === CommentOperationError.NOT_FOUND) {
      return context.json({ message: "Comment not found" }, 404);
    }
    if (e === CommentOperationError.UNAUTHORIZED) {
      return context.json(
        { message: "Unauthorized to delete this comment" },
        403
      );
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Update a comment
commentsRoutes.patch("/:commentId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { commentId } = context.req.param();
  const { content } = await context.req.json();

  try {
    const result = await updateComment({ commentId, userId, content });
    return context.json({ data: result }, 200);
  } catch (e) {
    if (e === CommentOperationError.NOT_FOUND) {
      return context.json({ message: "Comment not found" }, 404);
    }
    if (e === CommentOperationError.UNAUTHORIZED) {
      return context.json(
        { message: "Unauthorized to update this comment" },
        403
      );
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});
