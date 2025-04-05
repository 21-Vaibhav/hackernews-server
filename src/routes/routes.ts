import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes.js";
import { usersRoutes } from "./users-routes.js";
import { postsRoutes } from "./posts-routes.js";
import { commentsRoutes } from "./comments-routes.js";
import { likesRoutes } from "./likes-routes.js";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";

export const allRoutes = new Hono();

allRoutes.use(logger());

// Swagger UI Route
allRoutes.get(
  "/docs",
  swaggerUI({
    urls: [
      {
        url: "/openapi.json",
        name: "Hacker News API",
      },
    ],
  })
);

// OpenAPI JSON Specification Route
allRoutes.get("/openapi.json", (context) =>
  context.json({
    openapi: "3.0.0",
    info: {
      title: "Hacker News API",
      version: "1.0.0",
      description: "API documentation for the Hacker News backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    paths: {}, // Add paths here dynamically if needed
  })
);

// API Routes
allRoutes.route("/authentication", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/comments", commentsRoutes);
allRoutes.route("/likes", likesRoutes);

// Health Check
allRoutes.get("/health", (context) => {
  return context.json(
    {
      message: "All Ok",
    },
    200
  );
});
