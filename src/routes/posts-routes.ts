import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares.ts/token-middleware";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
} from "../controllers/posts/posts-controller";
import {
  CreatePostError,
  DeletePostError,
} from "../controllers/posts/posts-types";

export const postsRoutes = new Hono();

// Get all posts
postsRoutes.get("", tokenMiddleware, async (context) => {
  const page = Number(context.req.query("page")) || 1;
  const pageSize = Number(context.req.query("pageSize")) || 10;

  try {
    const result = await getAllPosts({ page, pageSize });
    return context.json({ data: result }, 200);
  } catch (e) {
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Get current user's posts
postsRoutes.get("/me", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const page = Number(context.req.query("page")) || 1;
  const pageSize = Number(context.req.query("pageSize")) || 10;

  try {
    const result = await getUserPosts({ userId, page, pageSize });
    return context.json({ data: result }, 200);
  } catch (e) {
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Create a post
postsRoutes.post("", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { content } = await context.req.json();

  try {
    const result = await createPost({ userId, content });
    return context.json({ data: result }, 201);
  } catch (e) {
    if (e === CreatePostError.UNAUTHORIZED) {
      return context.json({ message: "Unauthorized" }, 401);
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

// Delete a post
postsRoutes.delete("/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { postId } = context.req.param();

  try {
    await deletePost({ postId, userId });
    return context.json({ message: "Post deleted successfully" }, 200);
  } catch (e) {
    if (e === DeletePostError.NOT_FOUND) {
      return context.json({ message: "Post not found" }, 404);
    }
    if (e === DeletePostError.UNAUTHORIZED) {
      return context.json({ message: "Unauthorized to delete this post" }, 403);
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});
