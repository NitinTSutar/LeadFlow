import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  cookieSecure: process.env.COOKIE_SECURE === "true",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  authCookieName: "leadflow_token",
  tallyWebhookSecret: process.env.TALLY_WEBHOOK_SECRET,
  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    endpoint: process.env.R2_ENDPOINT,
  },
};

export function validateConfig() {
  const missing = ["MONGODB_URI", "JWT_SECRET", "TALLY_WEBHOOK_SECRET", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_ENDPOINT"].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(", ")}`);
  }
}
