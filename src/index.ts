import "dotenv/config";
import { allRoutes } from "./routes/routes";
import { serve } from "@hono/node-server";

const PORT = process.env.PORT || 5002; // Use PORT from .env or fallback to 5002

try {
  serve(allRoutes, (info) => {
    console.log(`Server is running @ http://${info.address}:${info.port}`);
  });
  console.log(`Server is running @ http://localhost:${PORT}`);
} catch (error) {
  console.error("Error starting server:", error);
}
