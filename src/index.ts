import "dotenv/config";
import { allRoutes } from "./routes/routes";
import { serve } from "@hono/node-server";

const PORT = Number(process.env.PORT) || 5002; // Default to 5002 if not set

try {
  serve({
    fetch: allRoutes.fetch, // Correct Hono serve format
    port: PORT, // Run on the specified or available port
    hostname: "localhost", // Ensure it runs on localhost
  });

  console.log(`✅ Server is running on http://localhost:${PORT}`);
} catch (error) {
  console.error("❌ Error starting server:", error);
}
