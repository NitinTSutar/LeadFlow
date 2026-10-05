import app from "./app.js";
import { createServer } from "node:http";
import { config, validateConfig } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { initializeSocket } from "./sockets/index.js";

try {
  validateConfig();
  await connectDatabase();

  const httpServer = createServer(app);
  initializeSocket(httpServer);
  httpServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
} catch (error) {
  console.error("Failed to start server:", error.message);
  process.exitCode = 1;
}
