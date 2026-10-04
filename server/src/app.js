import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error." });
});

export default app;
