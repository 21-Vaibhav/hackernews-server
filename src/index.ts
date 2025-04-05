import "dotenv/config";
import { allRoutes } from "./routes/routes.js";
import { serve } from "@hono/node-server";

const PORT = 3000; // Force port to 3000 to match Azure ingress

try {
  serve({
    fetch: allRoutes.fetch,
    port: PORT,
    hostname: "0.0.0.0", // Allow access from Docker
  });

  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
} catch (error) {
  console.error("❌ Error starting server:", error);
}
