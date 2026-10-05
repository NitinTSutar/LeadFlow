import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import devRoutes from "./routes/dev.routes.js";
import brokerageRoutes from "./routes/brokerage.routes.js";
import tallyRoutes from "./routes/tally.routes.js";
import clientRoutes from "./routes/client.routes.js";
import taskRoutes from "./routes/task.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/dev", devRoutes);
app.use("/api/brokerages", brokerageRoutes);
app.use("/api/webhooks", tallyRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  if (error.code === "LIMIT_FILE_SIZE") return res.status(413).json({ message: "The document exceeds the 10 MB size limit." });
  return res.status(500).json({ message: "Internal server error." });
});

export default app;
