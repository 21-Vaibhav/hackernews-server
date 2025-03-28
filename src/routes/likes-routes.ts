import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares.ts/token-middleware";
import {
  createLike,
  getPostLikes,
  deleteLike,
} from "../controllers/likes/likes-controller";
import {
  CreateLikeError,
  LikeOperationError,
} from "../controllers/likes/likes-types";

export const likesRoutes = new Hono();

// Get likes on a post
likesRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
  const { postId } = context.req.param();
  const page = Number(context.req.query("page")) || 1;
  const pageSize = Number(context.req.query("pageSize")) || 10;

  try {
    const result = await getPostLikes({ postId, page, pageSize });
    return context.json({ data: result }, 200);
  } catch (e) {
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Create a like on a post
likesRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { postId } = context.req.param();

  try {
    const result = await createLike({ userId, postId });
    return context.json({ data: result }, 201);
  } catch (e) {
    if (e === CreateLikeError.POST_NOT_FOUND) {
      return context.json({ message: "Post not found" }, 404);
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Delete a like on a post
likesRoutes.delete("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { postId } = context.req.param();

  try {
    await deleteLike({ postId, userId });
    return context.json({ message: "Like deleted successfully" }, 200);
  } catch (e) {
    if (e === LikeOperationError.NOT_FOUND) {
      return context.json({ message: "Like not found" }, 404);
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});
