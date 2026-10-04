import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  cookieSecure: process.env.COOKIE_SECURE === "true",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  authCookieName: "leadflow_token",
};

export function validateConfig() {
  const missing = ["MONGODB_URI", "JWT_SECRET"].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(", ")}`);
  }
}
