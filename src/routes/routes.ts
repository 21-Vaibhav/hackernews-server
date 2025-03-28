import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./users-routes";
import { postsRoutes } from "./posts-routes";
import { commentsRoutes } from "./comments-routes";
import { likesRoutes } from "./likes-routes";
import { logger } from "hono/logger";

export const allRoutes = new Hono();

allRoutes.use(logger());

allRoutes.route("/authentication", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/comments", commentsRoutes);
allRoutes.route("/likes", likesRoutes);

allRoutes.get("/health", (context) => {
  return context.json(
    {
      message: "All Ok",
    },
    200
  );
});
