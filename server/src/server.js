import app from "./app.js";
import { config, validateConfig } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

try {
  validateConfig();
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
} catch (error) {
  console.error("Failed to start server:", error.message);
  process.exitCode = 1;
}
